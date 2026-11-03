import assert from "node:assert/strict";
import { createCipheriv } from "node:crypto";
import { afterEach, beforeEach, mock, test } from "node:test";
import WrappedYMApi from "../src/WrappedYMApi.js";
import type YMApi from "../src/YMApi.js";
import {
  DownloadTrackCodec,
  DownloadTrackQuality,
  type DownloadOptions,
  type FileInfoResponseNew,
} from "../src/Types/index.js";
import { DownloadService } from "../src/wrapped/DownloadService.js";

const cryptUrl = "https://example.invalid/music-v2/crypt/track";
const rawUrl = "https://example.invalid/music-v2/raw/track";
const plaintext = Buffer.from(Array.from({ length: 513 }, (_, i) => (i * 37 + 11) % 256));
const keyHex = "000102030405060708090a0b0c0d0e0f";

beforeEach(() => {
  mock.method(globalThis, "fetch", async () => {
    assert.fail("streaming tests must not make network requests");
  });
});
afterEach(() => mock.restoreAll());

function responseFor(url = cryptUrl, key: unknown = keyHex): FileInfoResponseNew {
  return {
    downloadInfo: {
      trackId: "123",
      realId: "123",
      quality: "lossless",
      codec: "flac",
      bitrate: 1000,
      transport: "encraw",
      size: plaintext.length,
      gain: false,
      url,
      urls: [url],
      key,
    },
  };
}

function encrypt(data: Uint8Array, key = keyHex): Buffer {
  const bytes = Buffer.from(key, "hex");
  const cipher = createCipheriv(`aes-${bytes.length * 8}-ctr`, bytes, Buffer.alloc(16));
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

async function* chunksOf(data: Uint8Array, sizes: readonly number[], emptyChunks = false) {
  if (emptyChunks) yield new Uint8Array(0);
  let index = 0;
  for (let offset = 0; offset < data.length;) {
    const size = sizes[index++ % sizes.length]!;
    // Copy into a nonzero-offset view to catch accidental use of the entire backing buffer.
    const storage = new Uint8Array(size + 8).fill(0xff);
    const length = Math.min(size, data.length - offset);
    storage.set(data.subarray(offset, offset + length), 3);
    yield storage.subarray(3, 3 + length);
    offset += length;
    if (emptyChunks) yield new Uint8Array(0);
  }
}

async function collect(source: AsyncIterable<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of source) {
    assert.ok(chunk instanceof Uint8Array);
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

for (const keyBytes of [16, 24, 32]) {
  for (const sizes of [[1], [15], [16], [17], [31], [1, 15, 17, 2, 63, 16, 33]]) {
    test(`DownloadService.streamDownload decrypts AES-${keyBytes * 8}-CTR across chunks ${sizes}`, async () => {
      const key = Buffer.from(Array.from({ length: keyBytes }, (_, i) => i)).toString("hex");
      const source = chunksOf(encrypt(plaintext, key), sizes, true);
      const result = await collect(
        new DownloadService().streamDownload(responseFor(cryptUrl, key), source),
      );
      assert.deepEqual(result, plaintext);
    });
  }
}

test("DownloadService.streamDownload accepts uppercase AES hex keys", async () => {
  const result = await collect(
    new DownloadService().streamDownload(
      responseFor(cryptUrl, keyHex.toUpperCase()),
      chunksOf(encrypt(plaintext), [17]),
    ),
  );
  assert.deepEqual(result, plaintext);
});

test("DownloadService.streamDownload detects crypt URL from urls[0] without kts", async () => {
  const response = responseFor();
  delete (response.downloadInfo as Partial<FileInfoResponseNew["downloadInfo"]>).url;
  assert.deepEqual(
    await collect(
      new DownloadService().streamDownload(response, chunksOf(encrypt(plaintext), [15, 17])),
    ),
    plaintext,
  );
});

for (const encrypted of [false, true]) {
  test(`DownloadService.streamDownload handles empty payload (encrypted: ${encrypted})`, async () => {
    const response = responseFor(encrypted ? cryptUrl : rawUrl);
    for (const emptyChunks of [false, true]) {
      assert.deepEqual(
        await collect(
          new DownloadService().streamDownload(
            response,
            chunksOf(new Uint8Array(0), [1], emptyChunks),
          ),
        ),
        Buffer.alloc(0),
      );
    }
  });

  test(`DownloadService.streamDownload yields before upstream completion (encrypted: ${encrypted})`, async () => {
    const data = encrypted ? encrypt(plaintext) : plaintext;
    let canContinue = false;
    let completed = false;
    async function* source() {
      yield data.subarray(0, 17);
      assert.equal(canContinue, true, "must yield output before requesting the rest of the source");
      yield data.subarray(17);
      completed = true;
    }
    const stream = new DownloadService().streamDownload(
      responseFor(encrypted ? cryptUrl : rawUrl),
      source(),
    );
    try {
      const first = await stream.next();
      assert.equal(first.done, false);
      assert.ok(first.value instanceof Uint8Array);
      assert.ok(first.value.length > 0, "must yield actual payload, not an empty placeholder");
      assert.equal(completed, false);
      canContinue = true;
      assert.deepEqual(Buffer.concat([Buffer.from(first.value), await collect(stream)]), plaintext);
      assert.equal(completed, true);
    } finally {
      await stream.return(undefined);
    }
  });

  test(`DownloadService.streamDownload closes upstream on early break (encrypted: ${encrypted})`, async () => {
    let closed = 0;
    let pulls = 0;
    const data = encrypted ? encrypt(plaintext) : plaintext;
    async function* source() {
      try {
        pulls++;
        yield data.subarray(0, 17);
        pulls++;
        yield data.subarray(17);
      } finally {
        closed++;
      }
    }
    let received = 0;
    for await (const chunk of new DownloadService().streamDownload(
      responseFor(encrypted ? cryptUrl : rawUrl),
      source(),
    )) {
      if (chunk.length === 0) continue;
      received += chunk.length;
      break;
    }
    assert.ok(received > 0);
    assert.equal(pulls, 1, "must not drain upstream after consumer stops");
    assert.equal(closed, 1);
  });

  test(`DownloadService.streamDownload propagates upstream failure (encrypted: ${encrypted})`, async () => {
    const failure = new Error("upstream read failed");
    let closed = false;
    const data = encrypted ? encrypt(plaintext) : plaintext;
    async function* source() {
      try {
        yield data.subarray(0, 17);
        throw failure;
      } finally {
        closed = true;
      }
    }
    await assert.rejects(
      () =>
        collect(
          new DownloadService().streamDownload(
            responseFor(encrypted ? cryptUrl : rawUrl),
            source(),
          ),
        ),
      (error: unknown) => error === failure,
    );
    assert.equal(closed, true);
  });
}

test("DownloadService.streamDownload passes raw bytes through despite an invalid key and encraw metadata", async () => {
  const response = responseFor(rawUrl, "not-an-aes-key");
  response.downloadInfo.urls = [cryptUrl];
  assert.deepEqual(
    await collect(
      new DownloadService().streamDownload(response, chunksOf(plaintext, [1, 15, 17], true)),
    ),
    plaintext,
  );
});

for (const [name, key] of [
  ["missing", undefined],
  ["null", null],
  ["non-string", 123],
  ["empty", ""],
  ["15 bytes", "aa".repeat(15)],
  ["17 bytes", "aa".repeat(17)],
  ["23 bytes", "aa".repeat(23)],
  ["25 bytes", "aa".repeat(25)],
  ["31 bytes", "aa".repeat(31)],
  ["33 bytes", "aa".repeat(33)],
  ["odd length", "a".repeat(33)],
  ["non-hex", "gg".repeat(16)],
  ["partially valid hex", "aa".repeat(15) + "zz"],
  ["whitespace", " " + keyHex],
  ["hex prefix", "0x" + keyHex],
] as const) {
  test(`DownloadService.streamDownload rejects ${name} key before accessing source`, async () => {
    const response = responseFor(cryptUrl, key);
    if (key === undefined) delete response.downloadInfo.key;
    let iterations = 0;
    let reads = 0;
    const source: AsyncIterable<Uint8Array> = {
      [Symbol.asyncIterator]() {
        iterations++;
        return {
          async next() {
            reads++;
            return { done: true as const, value: undefined };
          },
        };
      },
    };
    await assert.rejects(
      async () => collect(new DownloadService().streamDownload(response, source)),
      /AES|key/i,
    );
    assert.equal(iterations, 0, "key validation must precede acquiring the upstream iterator");
    assert.equal(reads, 0);
  });
}

for (const scenario of [
  { name: "default MP3/raw", options: undefined, codec: "mp3", transport: "raw", fallback: false },
  {
    name: "FLAC/encraw options",
    options: { codec: DownloadTrackCodec.FLAC, quality: DownloadTrackQuality.Lossless },
    codec: "flac",
    transport: "encraw",
    fallback: false,
  },
  {
    name: "FLAC forceRaw options and urls[0] fallback",
    options: { codec: DownloadTrackCodec.FLAC, forceRaw: true },
    codec: "flac",
    transport: "raw",
    fallback: true,
  },
] satisfies {
  name: string;
  options: DownloadOptions | undefined;
  codec: string;
  transport: string;
  fallback: boolean;
}[]) {
  test(`WrappedYMApi.streamTrack uses ${scenario.name} and forwards AbortSignal`, async () => {
    const encrypted = scenario.transport === "encraw";
    const url = encrypted ? cryptUrl : rawUrl;
    const response = responseFor(url);
    response.downloadInfo.codec = scenario.codec;
    response.downloadInfo.transport = scenario.transport;
    if (scenario.fallback) {
      delete (response.downloadInfo as Partial<FileInfoResponseNew["downloadInfo"]>).url;
    }
    const calls: { method: string; args: unknown[] }[] = [];
    const signal = new AbortController().signal;
    const wrapped = new WrappedYMApi({
      tracks: {
        async getTrackDownloadInfoNew(...args: unknown[]) {
          calls.push({ method: "metadata", args });
          return response;
        },
        streamTrack(...args: unknown[]) {
          calls.push({ method: "stream", args });
          return chunksOf(encrypted ? encrypt(plaintext) : plaintext, [1, 15, 17], true);
        },
      },
    } as unknown as YMApi);

    const result = await collect(
      wrapped.streamTrack("https://music.yandex.ru/album/456/track/123", scenario.options, signal),
    );
    assert.deepEqual(result, plaintext);
    assert.deepEqual(calls, [
      {
        method: "metadata",
        args: [123, DownloadTrackQuality.Lossless, scenario.codec, scenario.transport],
      },
      { method: "stream", args: [url, signal] },
    ]);
  });
}

test("WrappedYMApi.streamTrack accepts a numeric track ID with omitted options and signal", async () => {
  const calls: unknown[][] = [];
  const wrapped = new WrappedYMApi({
    tracks: {
      async getTrackDownloadInfoNew(...args: unknown[]) {
        calls.push(args);
        return responseFor(rawUrl);
      },
      streamTrack(url: string, signal?: AbortSignal) {
        assert.equal(url, rawUrl);
        assert.equal(signal, undefined);
        return chunksOf(plaintext, [17]);
      },
    },
  } as unknown as YMApi);
  assert.deepEqual(await collect(wrapped.streamTrack(123)), plaintext);
  assert.deepEqual(calls, [[123, DownloadTrackQuality.Lossless, "mp3", "raw"]]);
});

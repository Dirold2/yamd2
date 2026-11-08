import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import WrappedYMApi from "../src/WrappedYMApi.js";
import type YMApi from "../src/YMApi.js";
import { ApiContext } from "../src/api/ApiContext.js";
import { AlbumApi } from "../src/api/AlbumApi.js";
import type { HyperClient } from "hyperttp";
import { DeviceAuthApi } from "../src/api/DeviceAuthApi.js";
import { PlaylistApi } from "../src/api/PlaylistApi.js";
import { TrackApi } from "../src/api/TrackApi.js";
import {
  DownloadTrackCodec,
  DownloadTrackQuality,
  type DeviceCode,
  type FileInfoResponseNew,
  type OAuthToken,
  type Playlist,
} from "../src/Types/index.js";
import { DownloadService } from "../src/wrapped/DownloadService.js";

test("AlbumApi.getAlbums sends form-encoded album IDs", async () => {
  const albums = [{ id: 12 }, { id: 34 }];
  const client = {
    async post(url: string, body: unknown, options: { headers: Record<string, string> }) {
      assert.equal(new URL(url).pathname, "/albums");
      assert.equal(options.headers["content-type"], "application/x-www-form-urlencoded");
      assert.equal(body, "albumIds=12%2C34");
      assert.equal(new URLSearchParams(body as string).get("albumIds"), "12,34");
      return { result: albums };
    },
  } as unknown as HyperClient;

  assert.equal(await new AlbumApi(new ApiContext(client)).getAlbums([12, 34]), albums);
});

// These tests mutate globals only within sequential top-level tests; test mocks
// restore them after each test, including when an assertion fails.
for (const { name, options, from, to } of [
  { name: "default range starts at zero", options: undefined, from: 0, to: 2 },
  { name: "default end includes the starting offset", options: { from: 7 }, from: 7, to: 9 },
  { name: "explicit end is preserved", options: { from: 7, to: 12 }, from: 7, to: 12 },
  { name: "explicit zero end is preserved", options: { to: 0 }, from: 0, to: 0 },
]) {
  test(`PlaylistApi.removeTracksFromPlaylist: ${name}`, async () => {
    let body: URLSearchParams | undefined;
    const request = {
      addHeaders() {
        return this;
      },
      setBodyData(value: URLSearchParams) {
        body = value;
        return this;
      },
    };
    const result = {} as Playlist;
    const api = new PlaylistApi({
      user: { uid: 42 },
      createRequest(path: string) {
        assert.equal(path, "/users/42/playlists/3/change-relative");
        return request;
      },
      async post(value: unknown) {
        assert.equal(value, request);
        return result;
      },
    } as unknown as ApiContext);
    const tracks = [
      { id: 1, albumId: 10 },
      { id: 2, albumId: 20 },
    ];

    assert.equal(await api.removeTracksFromPlaylist(3, tracks, 5, options), result);
    assert.ok(body);
    assert.equal(body.get("revision"), "5");
    assert.deepEqual(JSON.parse(body.get("diff")!), [{ op: "delete", from, to, tracks }]);
  });
}

function streamingApi(data: ReadableStream<Uint8Array>, status = 200): TrackApi {
  return new TrackApi({
    httpClient: {
      async stream(url: string) {
        assert.equal(url, "https://example.invalid/track");
        return { ok: status === 200, status, data };
      },
    },
  } as unknown as ApiContext);
}

for (const cancelRejects of [false, true]) {
  test(`TrackApi.streamTrack cancels HTTP error body and releases lock (cancel rejects: ${cancelRejects})`, async () => {
    let cancellations = 0;
    const body = new ReadableStream<Uint8Array>({
      cancel() {
        cancellations++;
        if (cancelRejects) throw new Error("cancel failed");
      },
    });
    const iterator = streamingApi(body, 403).streamTrack("https://example.invalid/track");

    await assert.rejects(iterator.next(), /HTTP 403/);
    assert.equal(cancellations, 1, "HTTP error bodies must be cancelled");
    assert.equal(body.locked, false, "HTTP error bodies must not retain a reader lock");
  });
}

test("TrackApi.streamTrack cancels and releases its reader on early break", async () => {
  let cancellations = 0;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array([1, 2]));
    },
    cancel() {
      cancellations++;
    },
  });
  const chunks: Uint8Array[] = [];

  for await (const chunk of streamingApi(body).streamTrack("https://example.invalid/track")) {
    chunks.push(chunk);
    break;
  }

  assert.deepEqual(chunks, [new Uint8Array([1, 2])]);
  assert.equal(cancellations, 1);
  assert.equal(body.locked, false);
});

test("TrackApi.streamTrack releases its reader even when early-break cancellation rejects", async () => {
  let cancellations = 0;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array([1]));
    },
    cancel() {
      cancellations++;
      throw new Error("cancel failed");
    },
  });
  // Whether cleanup errors propagate is not the regression: the lock must be
  // released in either case.
  await (async () => {
    for await (const _chunk of streamingApi(body).streamTrack("https://example.invalid/track")) {
      break;
    }
  })().catch((error: unknown) => {
    assert.match(String(error), /cancel failed/);
  });

  assert.equal(cancellations, 1);
  assert.equal(body.locked, false);
});

test("TrackApi.streamTrack normal completion yields all chunks without cancelling", async () => {
  let cancellations = 0;
  const expected = [new Uint8Array([1, 2]), new Uint8Array([3])];
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of expected) controller.enqueue(chunk);
      controller.close();
    },
    cancel() {
      cancellations++;
    },
  });
  const chunks: Uint8Array[] = [];
  for await (const chunk of streamingApi(body).streamTrack("https://example.invalid/track")) {
    chunks.push(chunk);
  }

  assert.deepEqual(chunks, expected);
  assert.equal(cancellations, 0);
  assert.equal(body.locked, false);
});

const playlistUuid = "ar.dcd89e75-5716-4605-9d69-9f6695979529";
for (const { name, input, user, args } of [
  { name: "bare UUID", input: playlistUuid, user: undefined, args: [playlistUuid] },
  {
    name: "UUID URL",
    input: `https://music.yandex.ru/playlists/${playlistUuid}`,
    user: undefined,
    args: [playlistUuid],
  },
  {
    name: "singular UUID URL",
    input: `https://music.yandex.ru/playlist/${playlistUuid}`,
    user: undefined,
    args: [playlistUuid],
  },
  {
    name: "user playlist URL",
    input: "https://music.yandex.ru/users/example.user/playlists/123",
    user: undefined,
    args: [123, "example.user"],
  },
  { name: "numeric playlist ID", input: 123, user: "example.user", args: [123, "example.user"] },
]) {
  test(`WrappedYMApi.getPlaylist routes ${name} to the underlying playlists API`, async () => {
    const calls: unknown[][] = [];
    const result = {} as Playlist;
    const wrapped = new WrappedYMApi({
      playlists: {
        async getPlaylist(...actual: unknown[]) {
          calls.push(actual);
          return result;
        },
      },
    } as unknown as YMApi);

    assert.equal(await wrapped.getPlaylist(input, user), result);
    assert.deepEqual(calls, [args]);
  });
}

function fakeClock(t: TestContext) {
  let now = 1_000;
  const sleeps: number[] = [];
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "setTimeout", ((callback: () => void, delay: number) => {
    sleeps.push(delay);
    now += delay;
    queueMicrotask(callback);
    return 0;
  }) as unknown as typeof setTimeout);
  return {
    sleeps,
    advance(ms: number) {
      now += ms;
    },
  };
}

class StubDeviceAuthApi extends DeviceAuthApi {
  polls = 0;
  constructor(private readonly poll: () => Promise<OAuthToken | null>) {
    super();
  }
  override async requestDeviceCode(): Promise<DeviceCode> {
    return {
      deviceCode: "test-code",
      userCode: "test-code",
      verificationUrl: "https://example.invalid",
      expiresIn: 1,
      interval: 5,
    };
  }
  override async pollDeviceToken(): Promise<OAuthToken | null> {
    this.polls++;
    return this.poll();
  }
}

// Identity-only sentinel: no credentials or real token are needed by these tests.
const token = {} as OAuthToken;

test("DeviceAuthApi.deviceAuth checks the deadline before the first poll", async (t) => {
  const clock = fakeClock(t);
  const api = new StubDeviceAuthApi(async () => token);
  await assert.rejects(
    api.deviceAuth(() => {}, { timeout: 0 }),
    /timed out/i,
  );
  assert.equal(api.polls, 0);
  assert.deepEqual(clock.sleeps, []);
});

for (const elapsed of [1_000, 1_001]) {
  test(`DeviceAuthApi.deviceAuth never returns a token at/after deadline (${elapsed}ms)`, async (t) => {
    const clock = fakeClock(t);
    const api = new StubDeviceAuthApi(async () => {
      await Promise.resolve();
      clock.advance(elapsed);
      return token;
    });
    await assert.rejects(
      api.deviceAuth(() => {}, { timeout: 1 }),
      /timed out/i,
    );
    assert.equal(api.polls, 1);
    assert.deepEqual(clock.sleeps, []);
  });
}

test("DeviceAuthApi.deviceAuth checks the deadline after an awaited pending poll", async (t) => {
  const clock = fakeClock(t);
  const api = new StubDeviceAuthApi(async () => {
    await Promise.resolve();
    clock.advance(1_000);
    return null;
  });
  await assert.rejects(
    api.deviceAuth(() => {}, { timeout: 1 }),
    /timed out/i,
  );
  assert.equal(api.polls, 1);
  assert.deepEqual(clock.sleeps, []);
});

test("DeviceAuthApi.deviceAuth caps sleep to remaining time and does not poll again at deadline", async (t) => {
  const clock = fakeClock(t);
  const api = new StubDeviceAuthApi(async () => {
    if (api.polls > 1) return token;
    clock.advance(250);
    return null;
  });
  await assert.rejects(
    api.deviceAuth(() => {}, { timeout: 1, pollInterval: 5 }),
    /timed out/i,
  );
  assert.deepEqual(clock.sleeps, [750]);
  assert.equal(api.polls, 1);
});

test("DeviceAuthApi.deviceAuth still returns a token before deadline", async (t) => {
  const clock = fakeClock(t);
  const api = new StubDeviceAuthApi(async () => {
    clock.advance(999);
    return token;
  });
  assert.equal(await api.deviceAuth(() => {}, { timeout: 1 }), token);
  assert.equal(api.polls, 1);
  assert.deepEqual(clock.sleeps, []);
});

test("DownloadService.getDownloadInfo rejects HTTP 403 before reading or decrypting the body", async (t) => {
  let bodyReads = 0;
  const url = "https://example.invalid/music-v2/crypt/track?kts=test";
  const fetchMock = t.mock.method(globalThis, "fetch", async (input: unknown) => {
    assert.equal(input, url);
    const response = new Response(null, { status: 403, statusText: "Forbidden" });
    t.mock.method(response, "arrayBuffer", async () => {
      bodyReads++;
      throw new Error("must not read an HTTP error body");
    });
    return response;
  });
  const response = {
    downloadInfo: {
      url,
      key: "00112233445566778899aabbccddeeff",
    },
  } as unknown as FileInfoResponseNew;

  await assert.rejects(
    new DownloadService().getDownloadInfo(
      response,
      123,
      DownloadTrackCodec.AAC,
      DownloadTrackQuality.Lossless,
      true,
    ),
    /403/,
  );
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(bodyReads, 0);
});

test("DownloadService decrypts an encrypted response and creates a Blob URL", async (t) => {
  const key = "00112233445566778899aabbccddeeff";
  const plain = new Uint8Array([1, 2, 3, 4, 5]);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(key, "hex"),
    "AES-CTR",
    false,
    ["encrypt"],
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-CTR", counter: new Uint8Array(16), length: 128 },
    cryptoKey,
    plain,
  );
  t.mock.method(globalThis, "fetch", async () => new Response(ciphertext));
  const response = {
    downloadInfo: { url: "https://example.invalid/music-v2/crypt/track", key },
  } as unknown as FileInfoResponseNew;
  const result = await new DownloadService().getDownloadInfo(
    response,
    123,
    DownloadTrackCodec.AAC,
    DownloadTrackQuality.Lossless,
    true,
  );
  try {
    assert.ok(result.decryptedBuffer);
    assert.deepEqual(new Uint8Array(result.decryptedBuffer), plain);
    assert.ok(result.decryptedUrl?.startsWith("blob:"));
  } finally {
    if (result.decryptedUrl) URL.revokeObjectURL(result.decryptedUrl);
  }
});

for (const key of [undefined, "", "not-hex", "00".repeat(15), "gg".repeat(16)]) {
  test(`DownloadService rejects invalid AES key before fetching (${String(key)})`, async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("must not fetch without a valid key");
    });
    const response = {
      downloadInfo: { url: "https://example.invalid/music-v2/crypt/track", key },
    } as unknown as FileInfoResponseNew;

    await assert.rejects(
      new DownloadService().getDownloadInfo(
        response,
        123,
        DownloadTrackCodec.AAC,
        DownloadTrackQuality.Lossless,
        true,
      ),
      /valid AES key/,
    );
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}

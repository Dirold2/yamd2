import { createDecipheriv } from "node:crypto";
import type {
  TrackId,
  TrackUrl,
  DownloadTrackQuality,
  DownloadTrackCodec,
  DecryptedDownloadInfo,
  FileInfoResponseNew,
} from "../Types/index.js";
import { DownloadTrackCodec as DTC } from "../Types/index.js";
import { DownloadError, DownloadInfoError } from "../Types/index.js";
import { decryptData } from "../CryptoYM.js";

function getEncryptionKey(response: FileInfoResponseNew): string {
  const key = response.downloadInfo.key;
  if (typeof key !== "string" || !/^(?:[0-9a-f]{32}|[0-9a-f]{48}|[0-9a-f]{64})$/i.test(key)) {
    throw new DownloadInfoError("Encrypted track download requires a valid AES key");
  }
  return key;
}

export class DownloadService {
  async *streamDownload(
    response: FileInfoResponseNew,
    source: AsyncIterable<Uint8Array>,
  ): AsyncGenerator<Uint8Array> {
    const info = response?.downloadInfo;
    const url = info?.url ?? info?.urls?.[0];
    if (!url) throw new DownloadInfoError("Track download URL missing");

    if (!url.includes("/music-v2/crypt/")) {
      yield* source;
      return;
    }

    const key = Buffer.from(getEncryptionKey(response), "hex");
    const decipher = createDecipheriv(`aes-${key.length * 8}-ctr`, key, Buffer.alloc(16));
    try {
      for await (const chunk of source) {
        const decrypted = decipher.update(chunk);
        if (decrypted.length > 0) yield decrypted;
      }
      const final = decipher.final();
      if (final.length > 0) yield final;
    } finally {
      decipher.destroy();
    }
  }
  async getDownloadInfo(
    response: FileInfoResponseNew,
    track: TrackId | TrackUrl,
    codec: DownloadTrackCodec,
    quality: DownloadTrackQuality,
    encrypted: boolean,
  ): Promise<DecryptedDownloadInfo> {
    const downloadInfo = response?.downloadInfo;
    if (!downloadInfo) throw new DownloadError(track, codec);

    const downloadUrl = downloadInfo.url ?? downloadInfo.urls?.[0];
    if (!downloadUrl) throw new DownloadError(track, codec);

    const base: DecryptedDownloadInfo = {
      codec: codec as any,
      bitrateInKbps: downloadInfo?.bitrate ?? 0,
      downloadInfoUrl: downloadUrl,
      direct: true,
      quality: (downloadInfo?.quality ?? quality) as DownloadTrackQuality,
      gain: downloadInfo?.gain ?? false,
      preview: false,
      encrypted,
    };

    if (!downloadUrl.includes("/music-v2/crypt/")) {
      return base;
    }

    const keyHex = getEncryptionKey(response);

    const res = await fetch(downloadUrl);
    if (!res.ok) {
      await res.body?.cancel().catch(() => {});
      throw new Error(`Track download failed: HTTP ${res.status}`);
    }
    const encryptedBytes = await res.arrayBuffer();

    const decryptedBuffer = await decryptData({
      key: keyHex,
      data: encryptedBytes,
      loadedBytes: 0,
    });

    let decryptedUrl: string | undefined;
    if (typeof URL !== "undefined" && typeof Blob !== "undefined") {
      const mime = codec === DTC.FLAC || codec === DTC.FLACMP4 ? "audio/flac" : "audio/mp4";

      const blob = new Blob([decryptedBuffer], { type: mime });
      decryptedUrl = URL.createObjectURL(blob);
    }

    return { ...base, decryptedBuffer, decryptedUrl };
  }

  isEncryptedUrl(url: string): boolean {
    return url.includes("/music-v2/crypt/") && url.includes("kts=");
  }
}

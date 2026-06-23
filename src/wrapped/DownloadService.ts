import type {
  TrackId,
  TrackUrl,
  DownloadTrackQuality,
  DownloadTrackCodec,
  DecryptedDownloadInfo,
  FileInfoResponseNew,
} from "../Types/index.js";
import { DownloadTrackCodec as DTC } from "../Types/index.js";
import { DownloadError } from "../Types/index.js";
import { decryptData } from "../CryptoYM.js";

export class DownloadService {
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

    const res = await fetch(downloadUrl);
    const encryptedBytes = await res.arrayBuffer();

    const keyHex = downloadInfo.key as string;
    if (!keyHex) return base;

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

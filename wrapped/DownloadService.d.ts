import type { TrackId, TrackUrl, DownloadTrackQuality, DownloadTrackCodec, DecryptedDownloadInfo, FileInfoResponseNew } from "../Types/index.js";
export declare class DownloadService {
    getDownloadInfo(response: FileInfoResponseNew, track: TrackId | TrackUrl, codec: DownloadTrackCodec, quality: DownloadTrackQuality, encrypted: boolean): Promise<DecryptedDownloadInfo>;
    isEncryptedUrl(url: string): boolean;
}

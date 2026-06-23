import type { TrackId, GetTrackResponse, Track, GetTrackSupplementResponse, SimilarTracksResponse, GetTrackDownloadInfoResponse, FileInfoResponseNew, Codecs, Transport, TrackLyrics, TrackTrailer, TrackFullInfo } from "../Types/index.js";
import { DownloadTrackQuality } from "../Types/index.js";
import { ApiContext } from "./ApiContext.js";
export declare class TrackApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /tracks/{trackId}
     * @ru Получить треки по ID.
     * @en Get tracks by ID.
     * @param trackId  Track ID (number or string).
     * @returns Promise with an array of tracks.
     */
    getTrack(trackId: TrackId): Promise<GetTrackResponse>;
    /**
     * POST: /tracks
     * @ru Получить несколько треков по их ID.
     * @en Get multiple tracks by IDs.
     * @param trackIds  Array of track IDs.
     * @returns Promise with an array of tracks.
     */
    getTracks(trackIds: TrackId[]): Promise<Track[]>;
    /**
     * GET: /tracks/{trackId}
     * @ru Получить один трек по ID (обёртка над getTrack).
     * @en Get a single track by ID (wrapper around getTrack).
     * @param trackId  Track ID.
     * @returns Promise with a single track.
     */
    getSingleTrack(trackId: TrackId): Promise<Track>;
    /**
     * GET: /tracks/{trackId}/supplement
     * @ru Получить дополнение к треку (связанный контент).
     * @en Get track supplement (related content).
     * @param trackId  Track ID.
     * @returns Promise with supplement.
     */
    getTrackSupplement(trackId: TrackId): Promise<GetTrackSupplementResponse>;
    /**
     * GET: /tracks/{trackId}/similar
     * @ru Получить похожие треки.
     * @en Get similar tracks.
     * @param trackId  Track ID.
     * @returns Promise with similar tracks.
     */
    getSimilarTracks(trackId: TrackId): Promise<SimilarTracksResponse>;
    /**
     * GET: /tracks/{trackId}/lyrics
     * @ru Получить текст трека.
     * @en Get track lyrics.
     * @param trackId  Track ID.
     * @param format  Lyrics format (TEXT, LRC).
     * @returns Promise with lyrics.
     */
    getTrackLyrics(trackId: TrackId, format?: string): Promise<TrackLyrics>;
    /**
     * GET: /tracks/{trackId}/trailer
     * @ru Получить трейлер трека.
     * @en Get track trailer.
     * @param trackId  Track ID.
     * @returns Promise with trailer.
     */
    getTrackTrailer(trackId: TrackId): Promise<TrackTrailer>;
    /**
     * GET: /tracks/{trackId}/full-info
     * @ru Получить полную информацию о треке.
     * @en Get full track info.
     * @param trackId  Track ID.
     * @returns Promise with full info.
     */
    getTrackFullInfo(trackId: TrackId): Promise<TrackFullInfo>;
    /**
     * GET: /tracks/{trackId}/download-info
     * @ru Получить информацию о загрузке трека.
     * @en Get track download info.
     * @param trackId  Track ID.
     * @param quality  Quality (LOW, MEDIUM, HIGH, Lossless).
     * @param canUseStreaming  Allow streaming.
     * @returns Promise with download info.
     */
    getTrackDownloadInfo(trackId: TrackId, quality?: DownloadTrackQuality, canUseStreaming?: boolean): Promise<GetTrackDownloadInfoResponse>;
    /**
     * GET: /get-file-info
     * @ru Получить информацию о загрузке (новая версия).
     * @en Get download file info (new version).
     * @param trackId  Track ID.
     * @param quality  Quality.
     * @param codecs  Allowed codecs.
     * @param transport  Transport (encraw, raw, etc.).
     * @returns Promise with file info.
     */
    getTrackDownloadInfoNew(trackId: number, quality?: DownloadTrackQuality, codecs?: Codecs, transport?: Transport): Promise<FileInfoResponseNew>;
    /**
     * GET: download URL
     * @ru Получить прямую ссылку на скачивание трека.
     * @en Get a direct download link for a track.
     * @param trackDownloadUrl  Download URL from getTrackDownloadInfo.
     * @param short  Shorten link via clck.ru.
     * @returns Promise with direct link.
     */
    getTrackDirectLink(trackDownloadUrl: string, short?: boolean): Promise<string>;
    /**
     * @ru Вернуть URL трека как есть (заглушка).
     * @en Return track URL as-is (passthrough).
     * @param trackUrl  Track URL.
     * @returns URL unchanged.
     */
    getTrackDirectLinkNew(trackUrl: string): string;
    /**
     * @ru Извлечь ID трека из URL.
     * @en Extract track ID from a URL.
     * @param url  URL like https://music.yandex.ru/album/{albumId}/track/{trackId}.
     * @returns Track ID.
     */
    extractTrackId(url: string): string;
    /**
     * @ru Получить ссылку на трек для шаринга.
     * @en Get a shareable link for a track.
     * @param track  Track ID or Track object.
     * @returns Promise with share URL.
     */
    getTrackShareLink(track: TrackId | Track): Promise<string>;
}

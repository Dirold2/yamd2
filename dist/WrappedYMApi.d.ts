import { type TrackId, type TrackUrl, type DownloadInfo, type ApiInitConfig, type InitResponse, DownloadTrackQuality, DownloadTrackCodec, type PlaylistId, type PlaylistUrl, type UserId, type UserName, type Playlist, type Track, type AlbumUrl, type AlbumId, type Album, type AlbumWithTracks, type ArtistId, type ArtistUrl, type FilledArtist } from "./Types";
import YMApi from "./YMApi";
export declare class YMApiError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class ExtractionError extends YMApiError {
    readonly entity: string;
    readonly input: string;
    constructor(entity: string, input: string);
}
export declare class DownloadError extends YMApiError {
    readonly trackId: TrackId | TrackUrl;
    readonly codec: DownloadTrackCodec;
    constructor(trackId: TrackId | TrackUrl, codec: DownloadTrackCodec);
}
interface DownloadOptions {
    codec?: DownloadTrackCodec;
    quality?: DownloadTrackQuality;
    forceRaw?: boolean;
}
export default class WrappedYMApi {
    private readonly api;
    private readonly client;
    private readonly urlExtractor;
    constructor(api?: YMApi);
    private setupUrlExtractor;
    /**
     * @ru Инициализация API клиента с аутентификацией.
     * @en Initialize API client with authentication.
     * @param config Параметры конфигурации API.
     * @returns Промис с данными авторизации.
     */
    init(config: ApiInitConfig): Promise<InitResponse>;
    /**
     * @ru Получить экземпляр базового API класса.
     * @en Get instance of the base API class.
     * @returns Экземпляр YMApi.
     */
    getApi(): YMApi;
    private extractNumericId;
    private getTrackId;
    private getAlbumId;
    private getArtistId;
    private getPlaylistId;
    /**
     * @ru Получить информацию для скачивания трека.
     * @en Get track download information.
     * @param track ID трека или URL.
     * @param options Опции скачивания (кодек, качество, etc.).
     * @returns Промис с информацией о скачивании.
     */
    getDownloadInfo(track: TrackId | TrackUrl, options?: DownloadOptions): Promise<DownloadInfo>;
    /**
     * @ru Получить прямую ссылку для скачивания трека.
     * @en Get direct download URL for track.
     * @param track ID трека или URL.
     * @param options Опции скачивания.
     * @returns Промис с прямой ссылкой на скачивание.
     */
    getDownloadUrl(track: TrackId | TrackUrl, options?: DownloadOptions): Promise<string>;
    /**
     * @ru Получить URL для скачивания в FFmpeg-compatible формате (MP3 raw).
     * @en Get FFmpeg-compatible download URL (raw MP3).
     * @param track Track ID or URL to download.
     * @param quality Quality level for download.
     * @returns Promise with download URL or null on error.
     */
    getDownloadUrlForFFmpeg(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<string | null>;
    /**
     * @ru Получить лучший доступный URL для скачивания по приоритету кодеков.
     * @en Get best available download URL based on codec priority.
     * @param track Track ID or URL to download.
     * @param quality Quality level for download.
     * @returns Promise with best available download URL or null.
     */
    getBestDownloadUrl(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<string | null>;
    /**
     * @ru Проверить, является ли URL зашифрованным.
     * @en Check if URL is encrypted.
     * @param url URL to check for encryption.
     * @returns True if URL is encrypted, false otherwise.
     */
    isEncryptedUrl(url: string): boolean;
    private createDownloadInfoGetter;
    private createDownloadUrlGetter;
    /**
     * @ru Получить информацию для скачивания MP3 трека.
     * @en Get MP3 track download information.
     */
    getMp3DownloadInfo: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<DownloadInfo>;
    /**
     * @ru Получить информацию для скачивания AAC трека.
     * @en Get AAC track download information.
     */
    getAacDownloadInfo: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<DownloadInfo>;
    /**
     * @ru Получить информацию для скачивания FLAC трека.
     * @en Get FLAC track download information.
     */
    getFlacDownloadInfo: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<DownloadInfo>;
    /**
     * @ru Получить информацию для скачивания FLAC-MP4 трека.
     * @en Get FLAC-MP4 track download information.
     */
    getFlacMP4DownloadInfo: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<DownloadInfo>;
    /**
     * @ru Получить URL для скачивания MP3 трека.
     * @en Get MP3 track download URL.
     */
    getMp3DownloadUrl: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<string>;
    /**
     * @ru Получить URL для скачивания AAC трека.
     * @en Get AAC track download URL.
     */
    getAacDownloadUrl: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<string>;
    /**
     * @ru Получить URL для скачивания FLAC трека.
     * @en Get FLAC track download URL.
     */
    getFlacDownloadUrl: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<string>;
    /**
     * @ru Получить URL для скачивания FLAC-MP4 трека.
     * @en Get FLAC-MP4 track download URL.
     */
    getFlacMP4DownloadUrl: (track: TrackId | TrackUrl, quality?: DownloadTrackQuality) => Promise<string>;
    /**
     * @ru Получить плейлист по ID или URL.
     * @en Get playlist by ID or URL.
     * @param playlist Playlist ID or URL.
     * @param user Optional user identifier for playlist ownership.
     * @returns Promise with playlist information.
     */
    getPlaylist(playlist: PlaylistId | PlaylistUrl, user?: UserId | UserName): Promise<Playlist>;
    /**
     * @ru Получить трек по ID или URL.
     * @en Get track by ID or URL.
     * @param track Track ID or URL.
     * @returns Promise with track information.
     */
    getTrack(track: TrackId | TrackUrl): Promise<Track>;
    /**
     * @ru Получить альбом по ID или URL.
     * @en Get album by ID or URL.
     * @param album Album ID or URL.
     * @param withTracks Whether to include tracks in response.
     * @returns Promise with album information.
     */
    getAlbum(album: AlbumId | AlbumUrl, withTracks?: boolean): Promise<Album | AlbumWithTracks>;
    /**
     * @ru Получить альбом с треками по ID или URL.
     * @en Get album with tracks by ID or URL.
     * @param album Album ID or URL.
     * @returns Promise with album including tracks.
     */
    getAlbumWithTracks(album: AlbumId | AlbumUrl): Promise<AlbumWithTracks>;
    /**
     * @ru Получить исполнителя по ID или URL.
     * @en Get artist by ID or URL.
     * @param artist Artist ID or URL.
     * @returns Promise with artist information.
     */
    getArtist(artist: ArtistId | ArtistUrl): Promise<FilledArtist>;
}
export {};

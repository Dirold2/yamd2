import { type ApiConfig, type ApiInitConfig, type InitResponse, type GetGenresResponse, type Playlist, type GetTrackResponse, type Language, type GetTrackSupplementResponse, type GetTrackDownloadInfoResponse, type GetFeedResponse, type GetAccountStatusResponse, type Track, type TrackId, type SearchOptions, type ConcreteSearchOptions, type SearchAllResponse, type SearchArtistsResponse, type SearchTracksResponse, type SearchAlbumsResponse, type AlbumId, type Album, type AlbumWithTracks, type FilledArtist, type Artist, type ArtistId, type ArtistTracksResponse, type DisOrLikedTracksResponse, type ChartType, type ChartTracksResponse, type NewReleasesResponse, type NewPlaylistsResponse, type PodcastsResponse, type SimilarTracksResponse, type StationTracksResponse, type StationInfoResponse, type AllStationsListResponse, type RecomendedStationsListResponse, type QueuesResponse, type QueueResponse, type RotorSessionCreateResponse, DownloadTrackQuality, type FileInfoResponseNew, type Codecs, type Transport } from "./Types/index.js";
import { HttpClientImproved } from "hyperttp";
export declare class YMApiError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class AuthError extends YMApiError {
    constructor(message?: string);
}
export declare class TrackNotFoundError extends YMApiError {
    readonly trackId: TrackId;
    constructor(trackId: TrackId);
}
export declare class DownloadInfoError extends YMApiError {
    constructor(message: string);
}
export declare class InvalidUrlError extends YMApiError {
    readonly url: string;
    constructor(url: string);
}
type UserId = number | string | null;
type SearchType = "all" | "artist" | "track" | "album";
type SearchResponseMap = {
    all: SearchAllResponse;
    artist: SearchArtistsResponse;
    track: SearchTracksResponse;
    album: SearchAlbumsResponse;
};
export default class YMApi {
    private readonly httpClient;
    private readonly config;
    private readonly user;
    private serverOffsetCache;
    constructor(httpClient?: HttpClientImproved, config?: ApiConfig);
    private get authHeader();
    private get deviceHeader();
    private resolveUserId;
    private assertAuthenticated;
    /** Creates an authenticated API request */
    private createRequest;
    /** Generic GET request with result extraction */
    private get;
    /** Generic POST request with result extraction */
    private post;
    /**
     * POST: /token
     * @ru Инициализация API клиента с аутентификацией.
     * @en Initialize API client with authentication.
     * @param config Параметры конфигурации API.
     * @returns Промис с данными авторизации.
     */
    init(config: ApiInitConfig): Promise<InitResponse>;
    /**
     * GET: /account/status
     * @ru Получить статус аккаунта текущего пользователя.
     * @en Get account status of current user.
     * @returns Promise с информацией об аккаунте.
     */
    getAccountStatus(): Promise<GetAccountStatusResponse>;
    /**
     * GET: /feed
     * @ru Получить ленту активности пользователя.
     * @en Get user's activity feed.
     * @returns Promise с лентой активности.
     */
    getFeed(): Promise<GetFeedResponse>;
    /**
     * GET: /landing3/chart/{chartType}
     * @ru Получить треки из чарта.
     * @en Get tracks from chart.
     * @param chartType Тип чарта (россия или мир).
     * @returns Promise с треками чарта.
     */
    getChart(chartType: ChartType): Promise<ChartTracksResponse>;
    /**
     * GET: /landing3/new-playlists
     * @ru Получить новые плейлисты.
     * @en Get new playlists.
     * @returns Promise с новыми плейлистами.
     */
    getNewPlaylists(): Promise<NewPlaylistsResponse>;
    /**
     * GET: /landing3/new-releases
     * @ru Получить новые релизы.
     * @en Get new releases.
     * @returns Promise с новыми релизами.
     */
    getNewReleases(): Promise<NewReleasesResponse>;
    /**
     * GET: /landing3/podcasts
     * @ru Получить подкасты.
     * @en Get podcasts.
     * @returns Promise с подкастами.
     */
    getPodcasts(): Promise<PodcastsResponse>;
    /**
     * GET: /genres
     * @ru Получить список музыкальных жанров.
     * @en Get list of music genres.
     * @returns Promise со списком жанров.
     */
    getGenres(): Promise<GetGenresResponse>;
    /**
     * GET: /search
     * @ru Поиск контента в Yandex Music.
     * @en Search content in Yandex Music.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска.
     */
    search<T extends SearchType = "all">(query: string, options?: SearchOptions & {
        type?: T;
    }): Promise<SearchResponseMap[T]>;
    /**
     * @ru Поиск исполнителей.
     * @en Search for artists.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска исполнителей.
     */
    searchArtists(query: string, options?: ConcreteSearchOptions): Promise<SearchArtistsResponse>;
    /**
     * @ru Поиск треков.
     * @en Search for tracks.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска треков.
     */
    searchTracks(query: string, options?: ConcreteSearchOptions): Promise<SearchTracksResponse>;
    /**
     * @ru Поиск альбомов.
     * @en Search for albums.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска альбомов.
     */
    searchAlbums(query: string, options?: ConcreteSearchOptions): Promise<SearchAlbumsResponse>;
    /**
     * @ru Поиск контента всех типов.
     * @en Search all content types.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска всех типов.
     */
    searchAll(query: string, options?: ConcreteSearchOptions): Promise<SearchAllResponse>;
    /**
     * GET: /users/{uid}/playlists/list
     * @ru Получить плейлисты пользователя.
     * @en Get user's playlists.
     * @param userId ID пользователя (опционально).
     * @returns Promise с массивом плейлистов.
     */
    getUserPlaylists(userId?: UserId): Promise<Playlist[]>;
    /**
     * GET: /users/{uid}/playlists/{id} or GET: /playlist/{id}
     * @ru Получить плейлист по ID.
     * @en Get playlist by ID.
     * @param playlistId Идентификатор плейлиста.
     * @param user ID пользователя (для числовых ID).
     * @returns Promise с плейлистом.
     */
    getPlaylist(playlistId: number, user?: UserId): Promise<Playlist>;
    getPlaylist(playlistId: string): Promise<Playlist>;
    /** @deprecated Используйте getPlaylist(string) вместо этого метода.
     *  @en Use getPlaylist(string) instead of this method. */
    getPlaylistNew(playlistId: string): Promise<Playlist>;
    /**
     * GET: /users/{uid}/playlists
     * @ru Получить несколько плейлистов.
     * @en Get multiple playlists.
     * @param playlists Массив ID плейлистов.
     * @param user ID пользователя.
     * @param options Опции загрузки.
     * @returns Promise с массивом плейлистов.
     */
    getPlaylists(playlists: number[], user?: UserId, options?: {
        mixed?: boolean;
        "rich-tracks"?: boolean;
    }): Promise<Playlist[]>;
    /**
     * POST: /users/{uid}/playlists/create
     * @ru Создать новый плейлист.
     * @en Create new playlist.
     * @param name Название плейлиста.
     * @param options Опции видимости.
     * @returns Promise с созданным плейлистом.
     */
    createPlaylist(name: string, options?: {
        visibility?: "public" | "private";
    }): Promise<Playlist>;
    /**
     * POST: /users/{uid}/playlists/{id}/delete
     * @ru Удалить плейлист.
     * @en Delete playlist.
     * @param playlistId ID плейлиста.
     * @returns Promise с результатом удаления.
     */
    removePlaylist(playlistId: number): Promise<"ok" | string>;
    /**
     * POST: /users/{uid}/playlists/{id}/name
     * @ru Переименовать плейлист.
     * @en Rename playlist.
     * @param playlistId ID плейлиста.
     * @param name Новое название.
     * @returns Promise с обновленным плейлистом.
     */
    renamePlaylist(playlistId: number, name: string): Promise<Playlist>;
    /**
     * POST: /users/{uid}/playlists/{id}/change-relative
     * @ru Добавить треки в плейлист.
     * @en Add tracks to playlist.
     * @param playlistId ID плейлиста.
     * @param tracks Массив треков для добавления.
     * @param revision Ревизия плейлиста.
     * @param options Опции позиции.
     * @returns Promise с обновленным плейлистом.
     */
    addTracksToPlaylist(playlistId: number | string, tracks: Array<{
        id: number | string;
        albumId: number | string;
    }>, revision: number, options?: {
        at?: number;
    }): Promise<Playlist>;
    /**
     * POST: /users/{uid}/playlists/{id}/change-relative
     * @ru Удалить треки из плейлиста.
     * @en Remove tracks from playlist.
     * @param playlistId ID плейлиста.
     * @param tracks Массив треков для удаления.
     * @param revision Ревизия плейлиста.
     * @param options Опции диапазона.
     * @returns Promise с обновленным плейлистом.
     */
    removeTracksFromPlaylist(playlistId: number, tracks: Array<{
        id: number;
        albumId: number;
    }>, revision: number, options?: {
        from?: number;
        to?: number;
    }): Promise<Playlist>;
    /**
     * @ru Получить информацию о треке по ID.
     * @en Get track information by ID.
     * @param trackId Идентификатор трека.
     * @returns Promise с информацией о треке.
     */
    getTrack(trackId: TrackId): Promise<GetTrackResponse>;
    /**
     * @ru Получить одиночный трек по ID.
     * @en Get single track by ID.
     * @param trackId Идентификатор трека.
     * @returns Promise с треком.
     */
    getSingleTrack(trackId: TrackId): Promise<Track>;
    /**
     * @ru Получить дополнительную информацию о треке.
     * @en Get additional track information.
     * @param trackId Идентификатор трека.
     * @returns Promise с дополнительной информацией.
     */
    getTrackSupplement(trackId: TrackId): Promise<GetTrackSupplementResponse>;
    /**
     * @ru Получить похожие треки.
     * @en Get similar tracks.
     * @param trackId Идентификатор трека.
     * @returns Promise с похожими треками.
     */
    getSimilarTracks(trackId: TrackId): Promise<SimilarTracksResponse>;
    /**
     * @ru Получить информацию для скачивания трека.
     * @en Get track download information.
     * @param trackId Идентификатор трека.
     * @param quality Качество загрузки.
     * @param canUseStreaming Разрешить использование стриминга.
     * @returns Promise с информацией о загрузке.
     */
    getTrackDownloadInfo(trackId: TrackId, quality?: DownloadTrackQuality, canUseStreaming?: boolean): Promise<GetTrackDownloadInfoResponse>;
    /**
     * @ru Получить информацию для скачивания трека (новый метод).
     * @en Get track download information (new method).
     * @param trackId Идентификатор трека.
     * @param quality Качество загрузки.
     * @param codecs Кодеки.
     * @param transport Тип транспорта.
     * @returns Promise с информацией о файле.
     */
    getTrackDownloadInfoNew(trackId: number, quality?: DownloadTrackQuality, codecs?: Codecs, transport?: Transport): Promise<FileInfoResponseNew>;
    /**
     * @ru Получить прямую ссылку на скачивание трека.
     * @en Get direct download link for track.
     * @param trackDownloadUrl URL для скачивания.
     * @param short Использовать короткую ссылку.
     * @returns Promise со ссылкой для скачивания.
     */
    getTrackDirectLink(trackDownloadUrl: string, short?: boolean): Promise<string>;
    /**
     * @ru Получить прямую ссылку на трек (новый метод).
     * @en Get direct track link (new method).
     * @param trackUrl URL трека.
     * @returns Прямая ссылка на трек.
     */
    getTrackDirectLinkNew(trackUrl: string): string;
    /**
     * @ru Извлечь ID трека из URL.
     * @en Extract track ID from URL.
     * @param url URL трека.
     * @returns ID трека.
     */
    extractTrackId(url: string): string;
    /**
     * @ru Получить ссылку для поделиться треком.
     * @en Get share link for track.
     * @param track Трек или ID трека.
     * @returns Promise со ссылкой для поделиться.
     */
    getTrackShareLink(track: TrackId | Track): Promise<string>;
    /**
     * @ru Получить информацию об альбоме.
     * @en Get album information.
     * @param albumId Идентификатор альбома.
     * @param withTracks Включать треки в ответ.
     * @returns Promise с информацией об альбоме.
     */
    getAlbum(albumId: AlbumId, withTracks?: boolean): Promise<Album | AlbumWithTracks>;
    /**
     * @ru Получить альбом с треками.
     * @en Get album with tracks.
     * @param albumId Идентификатор альбома.
     * @returns Promise с альбомом и треками.
     */
    getAlbumWithTracks(albumId: AlbumId): Promise<AlbumWithTracks>;
    /**
     * @ru Получить информацию о нескольких альбомах.
     * @en Get information about multiple albums.
     * @param albumIds Массив ID альбомов.
     * @returns Promise с массивом альбомов.
     */
    getAlbums(albumIds: AlbumId[]): Promise<Album[]>;
    /**
     * @ru Получить информацию об исполнителе.
     * @en Get artist information.
     * @param artistId Идентификатор исполнителя.
     * @returns Promise с полной информацией об исполнителе.
     */
    getArtist(artistId: ArtistId): Promise<FilledArtist>;
    /**
     * @ru Получить информацию о нескольких исполнителях.
     * @en Get information about multiple artists.
     * @param artistIds Массив ID исполнителей.
     * @returns Promise с массивом исполнителей.
     */
    getArtists(artistIds: ArtistId[]): Promise<Artist[]>;
    /**
     * @ru Получить треки исполнителя.
     * @en Get artist tracks.
     * @param artistId Идентификатор исполнителя.
     * @param options Опции пагинации.
     * @returns Promise с треками исполнителя.
     */
    getArtistTracks(artistId: ArtistId, options?: SearchOptions): Promise<ArtistTracksResponse>;
    /**
     * @ru Получить понравившиеся треки пользователя.
     * @en Get user's liked tracks.
     * @param userId ID пользователя (опционально).
     * @returns Promise с понравившимися треками.
     */
    getLikedTracks(userId?: UserId): Promise<DisOrLikedTracksResponse>;
    /**
     * @ru Получить не понравившиеся треки пользователя.
     * @en Get user's disliked tracks.
     * @param userId ID пользователя (опционально).
     * @returns Promise с не понравившимися треками.
     */
    getDislikedTracks(userId?: UserId): Promise<DisOrLikedTracksResponse>;
    /**
     * @ru Получить список всех радиостанций.
     * @en Get list of all radio stations.
     * @param language Язык для списка станций.
     * @returns Promise со списком радиостанций.
     */
    getAllStationsList(language?: Language): Promise<AllStationsListResponse>;
    /**
     * @ru Получить рекомендованные радиостанции.
     * @en Get recommended radio stations.
     * @returns Promise с рекомендованными радиостанциями.
     */
    getRecomendedStationsList(): Promise<RecomendedStationsListResponse>;
    /**
     * @ru Получить треки радиостанции.
     * @en Get radio station tracks.
     * @param stationId ID радиостанции.
     * @param queue ID предыдущего трека.
     * @returns Promise с треками станции.
     */
    getStationTracks(stationId: string, queue?: string): Promise<StationTracksResponse>;
    /**
     * @ru Получить информацию о радиостанции.
     * @en Get radio station information.
     * @param stationId ID радиостанции.
     * @returns Promise с информацией о станции.
     */
    getStationInfo(stationId: string): Promise<StationInfoResponse>;
    /**
     * @ru Создать сессию Rotor.
     * @en Create Rotor session.
     * @param seeds Массив ID станций.
     * @param includeTracksInResponse Включать треки в ответ.
     * @returns Promise с созданной сессией.
     */
    createRotorSession(seeds: string[], includeTracksInResponse?: boolean): Promise<RotorSessionCreateResponse>;
    /**
     * @ru Получить треки сессии Rotor.
     * @en Get Rotor session tracks.
     * @param sessionId ID сессии.
     * @param options Опции запроса.
     * @returns Promise с треками сессии.
     */
    postRotorSessionTracks(sessionId: string, options?: {
        queue?: string[];
        batchId?: string;
    }): Promise<RotorSessionCreateResponse>;
    /**
     * @ru Получить список очередей воспроизведения.
     * @en Get list of playback queues.
     * @returns Promise со списком очередей.
     */
    getQueues(): Promise<QueuesResponse>;
    /**
     * @ru Получить информацию об очереди воспроизведения.
     * @en Get playback queue information.
     * @param queueId ID очереди.
     * @returns Promise с информацией об очереди.
     */
    getQueue(queueId: string): Promise<QueueResponse>;
    private getYandexServerOffset;
    private generateTrackSignature;
}
export {};

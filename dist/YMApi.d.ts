import { ApiConfig, ApiInitConfig, InitResponse, GetGenresResponse, SearchResponse, Playlist, GetTrackResponse, Language, GetTrackSupplementResponse, GetTrackDownloadInfoResponse, GetFeedResponse, GetAccountStatusResponse, Track, TrackId, SearchOptions, ConcreteSearchOptions, SearchAllResponse, SearchArtistsResponse, SearchTracksResponse, SearchAlbumsResponse, AlbumId, Album, AlbumWithTracks, FilledArtist, Artist, ArtistId, ArtistTracksResponse, DisOrLikedTracksResponse, ChartType, ChartTracksResponse, NewReleasesResponse, NewPlaylistsResponse, PodcastsResponse, SimilarTracksResponse, StationTracksResponse, StationInfoResponse, AllStationsListResponse, RecomendedStationsListResponse, QueuesResponse, QueueResponse, RotorSessionCreateResponse, FileInfoResponseNew } from "./Types";
import { HttpClientInterface } from "./Types/request";
import { Types } from '.';
export default class YMApi {
    private httpClient;
    private config;
    private user;
    constructor(httpClient?: HttpClientInterface, config?: ApiConfig);
    private getAuthHeader;
    private getFakeDeviceHeader;
    /**
     * Authentication
     * @returns access_token & uid
     */
    init(config: ApiInitConfig): Promise<InitResponse>;
    /**
     * GET: /account/status
     * @returns account status for current user
     */
    getAccountStatus(): Promise<GetAccountStatusResponse>;
    /**
     * GET: /feed
     * @returns the user's feed
     */
    getFeed(): Promise<GetFeedResponse>;
    /**
     *
     * @param ChartType Type of chart.
     * GET: /landing3/chart/{ChartType}
     * @returns chart of songs.
     */
    getChart(ChartType: ChartType): Promise<ChartTracksResponse>;
    /**
     * GET: /landing3/new-playlists
     * @returns new playlists (for you).
     */
    getNewPlaylists(): Promise<NewPlaylistsResponse>;
    /**
     * GET: /landing3/new-releases
     * @returns new releases.
     */
    getNewReleases(): Promise<NewReleasesResponse>;
    /**
     * GET: /landing3/podcasts
     * @returns all podcasts.
     */
    getPodcasts(): Promise<PodcastsResponse>;
    /**
     * GET: /genres
     * @returns a list of music genres
     */
    getGenres(): Promise<GetGenresResponse>;
    /**
     * GET: /search
     * Search artists, tracks, albums.
     * @returns Every {type} with query in it's title.
     */
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
    /**
     * @param query Query
     * @param options Options
     * @returns Every artist with query in it's title.
     */
    searchArtists(query: string, options?: ConcreteSearchOptions): Promise<SearchArtistsResponse>;
    /**
     * @param query Query
     * @param options Options
     * @returns Every track with query in it's title.
     */
    searchTracks(query: string, options?: ConcreteSearchOptions): Promise<SearchTracksResponse>;
    /**
     * @param query Query
     * @param options Options
     * @returns Every album with query in it's title.
     */
    searchAlbums(query: string, options?: ConcreteSearchOptions): Promise<SearchAlbumsResponse>;
    /**
     * @param query Query
     * @param options Options
     * @returns Everything with query in it's title.
     */
    searchAll(query: string, options?: ConcreteSearchOptions): Promise<SearchAllResponse>;
    /**
     * GET: /users/[user_id]/playlists/list
     * @returns a user's playlists.
     */
    getUserPlaylists(user?: number | string | null): Promise<Array<Playlist>>;
    /**
     * GET: /users/[user_id]/playlists/[playlist_kind] when `playlistId` is a number (kind)
     * GET: /playlist/[playlist_uuid] when `playlistId` is a string (UUID)
     * @returns a playlist without tracks
     */
    getPlaylist(playlistId: number, user?: number | string | null): Promise<Playlist>;
    getPlaylist(playlistId: string): Promise<Playlist>;
    /**
     * GET: /playlist/[playlist_uuid]
     * @returns a playlist without tracks
     */
    getPlaylistNew(playlistId: string): Promise<Playlist>;
    /**
     * GET: /users/[user_id]/playlists
     * @returns an array of playlists with tracks
     */
    getPlaylists(playlists: Array<number>, user?: number | string | null, options?: {
        mixed?: boolean;
        "rich-tracks"?: boolean;
    }): Promise<Array<Playlist>>;
    /**
     * POST: /users/[user_id]/playlists/create
     * Create a new playlist
     * @returns Playlist
     */
    createPlaylist(name: string, options?: {
        visibility?: "public" | "private";
    }): Promise<Playlist>;
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/delete
     * Remove a playlist
     * @returns "ok" | string
     */
    removePlaylist(playlistId: number): Promise<"ok" | string>;
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/name
     * Change playlist name
     * @returns Playlist
     */
    renamePlaylist(playlistId: number, name: string): Promise<Playlist>;
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Add tracks to the playlist
     * @returns Playlist
     */
    addTracksToPlaylist(playlistId: number, tracks: Array<{
        id: number;
        albumId: number;
    }>, revision: number, options?: {
        at?: number;
    }): Promise<Playlist>;
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Remove tracks from the playlist
     * @returns Playlist
     */
    removeTracksFromPlaylist(playlistId: number, tracks: Array<{
        id: number;
        albumId: number;
    }>, revision: number, options?: {
        from?: number;
        to?: number;
    }): Promise<Playlist>;
    /**
     * GET: /tracks/[track_id]
     * @returns an array of playlists with tracks
     */
    getTrack(trackId: TrackId): Promise<GetTrackResponse>;
    /**
     * GET: /tracks/[track_id]
     * @returns single track
     */
    getSingleTrack(trackId: TrackId): Promise<Track>;
    /**
     * GET: /tracks/[track_id]/supplement
     * @returns an array of playlists with tracks
     */
    getTrackSupplement(trackId: TrackId): Promise<GetTrackSupplementResponse>;
    /**
     * GET: /tracks/[track_id]/download-info
     * @returns track download information
     */
    getTrackDownloadInfo(trackId: TrackId, canUseStreaming?: Boolean): Promise<GetTrackDownloadInfoResponse>;
    getTrackDownloadInfoNew(trackId: string, quality?: Types.DownloadTrackQuality): Promise<FileInfoResponseNew>;
    /**
     * @returns track direct link
     */
    getTrackDirectLink(trackDownloadUrl: string, short?: Boolean): Promise<string>;
    getTrackDirectLinkNew(trackUrl: string): Promise<string>;
    extractTrackId(url: string): string;
    /**
     * @returns track sharing link
     */
    getTrackShareLink(track: TrackId | Track): Promise<string>;
    /**
     * GET: /tracks/{track_id}/similar
     * @returns simmilar tracks
     */
    getSimilarTracks(trackId: TrackId): Promise<SimilarTracksResponse>;
    /**
     * GET: /albums/[album_id]
     * @returns an album
     */
    getAlbum(albumId: AlbumId, withTracks?: boolean): Promise<Album>;
    getAlbumWithTracks(albumId: AlbumId): Promise<AlbumWithTracks>;
    /**
     * GET: /albums
     * @returns an albums
     */
    getAlbums(albumIds: Array<AlbumId>): Promise<Array<Album>>;
    /**
     * GET: /artists/[artist_id]
     * @returns an artist
     */
    getArtist(artistId: ArtistId): Promise<FilledArtist>;
    /**
     * GET: /artists
     * @returns an artists
     */
    getArtists(artistIds: Array<ArtistId>): Promise<Array<Artist>>;
    /**
     * GET: /artists/[artist_id]/tracks
     * @returns Tracks by artist id
     */
    getArtistTracks(artistId: ArtistId, options?: SearchOptions): Promise<ArtistTracksResponse>;
    /**
     * GET: /users/{userId}/likes/tracks
     * @param userId User id. Nullable.
     * @returns Liked Tracks
     */
    getLikedTracks(userId?: number | string | null): Promise<DisOrLikedTracksResponse>;
    /**
     * GET: /users/{userId}/dislikes/tracks
     * @param userId User id. Nullable.
     * @returns Disliked Tracks
     */
    getDislikedTracks(userId?: number | string | null): Promise<DisOrLikedTracksResponse>;
    /**
     * GET: /rotor/stations/list
     * @param language Language of station list
     * @returns list of stations.
     */
    getAllStationsList(language?: Language): Promise<AllStationsListResponse>;
    /**
     * GET: /rotor/stations/dashboard
     * REQUIRES YOU TO BE LOGGED IN!
     * @returns list of recomended stations.
     */
    getRecomendedStationsList(): Promise<RecomendedStationsListResponse>;
    /**
     * GET: /rotor/station/{stationId}/tracks
     * REQUIRES YOU TO BE LOGGED IN!
     * @param stationId Id of station. Example: user:onyourwave
     * @param queue Unique id of prev track.
     * @returns tracks from station.
     */
    getStationTracks(stationId: string, queue?: string): Promise<StationTracksResponse>;
    /**
     * GET: /rotor/station/{stationId}/info
     * @param stationId Id of station. Example: user:onyourwave
     * @returns info of the station.
     */
    getStationInfo(stationId: string): Promise<StationInfoResponse>;
    /**
     * POST: /rotor/session/new
     * @param seeds array of station ids e.g. ["user:onyourwave"]
     * @param includeTracksInResponse whether to include tracks in response
     */
    createRotorSession(seeds: Array<string>, includeTracksInResponse?: boolean): Promise<RotorSessionCreateResponse>;
    /**
     * POST: /rotor/session/{sessionId}/tracks
     * Retrieves the next batch of tracks within an existing session
     * @param sessionId The ID of the active session (radioSessionId)
     * @param options Object containing optional parameters such as queue (previous track ID), batchId, etc.
     */
    postRotorSessionTracks(sessionId: string, options?: {
        queue?: string[];
        batchId?: string;
    }): Promise<RotorSessionCreateResponse>;
    /**
     * GET: /queues
     * @returns queues without tracks
     */
    getQueues(): Promise<QueuesResponse>;
    /**
     * GET: /queues/{queueId}
     * @param queueId Queue id.
     * @returns queue data with(?) tracks.
     */
    getQueue(queueId: string): Promise<QueueResponse>;
}

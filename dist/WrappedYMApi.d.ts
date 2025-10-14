import { type UrlExtractorInterface, type TrackId, type TrackUrl, type DownloadInfo, type ApiInitConfig, type InitResponse, DownloadTrackQuality, DownloadTrackCodec, type PlaylistId, type PlaylistUrl, type UserId, type UserName, type Playlist, type Track, type AlbumUrl, type AlbumId, type Album, type AlbumWithTracks, type ArtistId, type ArtistUrl, type FilledArtist } from "./Types";
import YMApi from "./YMApi";
export default class WrappedYMApi {
    private api;
    private urlExtractor;
    constructor(api?: YMApi, urlExtractor?: UrlExtractorInterface);
    init(config: ApiInitConfig): Promise<InitResponse>;
    getApi(): YMApi;
    private getTrackId;
    private getAlbumId;
    private getArtistId;
    private getPlaylistId;
    getConcreteDownloadInfo(track: TrackId | TrackUrl, codec: DownloadTrackCodec, quality: DownloadTrackQuality): Promise<DownloadInfo>;
    getConcreteDownloadInfoNew(track: TrackId | TrackUrl, codec: DownloadTrackCodec, quality?: DownloadTrackQuality): Promise<DownloadInfo>;
    getMp3DownloadInfoNew(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<DownloadInfo>;
    getMp3DownloadInfo(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<DownloadInfo>;
    getAacDownloadInfo(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<DownloadInfo>;
    getFlacDownloadInfo(track: TrackId | TrackUrl, quality?: DownloadTrackQuality): Promise<DownloadInfo>;
    getMp3DownloadUrl(track: TrackId | TrackUrl, short?: boolean, quality?: DownloadTrackQuality): Promise<string>;
    getMp3DownloadUrlNew(track: TrackId | TrackUrl, short?: boolean, quality?: DownloadTrackQuality): Promise<string>;
    getAacDownloadUrl(track: TrackId | TrackUrl, short?: boolean, quality?: DownloadTrackQuality): Promise<string>;
    getFlacDownloadUrl(track: TrackId | TrackUrl, short?: boolean, quality?: DownloadTrackQuality): Promise<string>;
    getBestDownloadUrl(track: TrackId | TrackUrl, short?: boolean, quality?: DownloadTrackQuality): Promise<string | null>;
    getPlaylist(playlist: PlaylistId | PlaylistUrl, user?: UserId | UserName): Promise<Playlist>;
    getTrack(track: TrackId | TrackUrl): Promise<Track>;
    getAlbum(album: AlbumId | AlbumUrl, withTracks?: boolean): Promise<Album>;
    getAlbumWithTracks(album: AlbumId | AlbumUrl): Promise<AlbumWithTracks>;
    getArtist(artist: ArtistId | ArtistUrl): Promise<FilledArtist>;
}

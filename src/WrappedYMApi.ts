import { UrlExtractor } from "hyperttp";
import type {
  TrackId,
  TrackUrl,
  ApiInitConfig,
  InitResponse,
  DownloadTrackQuality,
  DecryptedDownloadInfo,
  PlaylistId,
  PlaylistUrl,
  UserId,
  UserName,
  Playlist,
  Track,
  AlbumUrl,
  AlbumId,
  Album,
  AlbumWithTracks,
  ArtistId,
  ArtistUrl,
  FilledArtist,
  DownloadOptions,
} from "./Types/index.js";
import { DownloadTrackCodec as DTC } from "./Types/index.js";
import { ExtractionError } from "./Types/index.js";
import YMApi from "./YMApi.js";
import { CODEC_CONFIG } from "./wrapped/CodecConfig.js";
import { DownloadService } from "./wrapped/DownloadService.js";

export { YMApiError, ExtractionError, DownloadError } from "./Types/index.js";

interface PlaylistIdentifier {
  id: PlaylistId | string;
  user: UserName | null;
}

export default class WrappedYMApi {
  private readonly urlExtractor: UrlExtractor;
  private readonly downloadService: DownloadService;

  constructor(private readonly api: YMApi = new YMApi()) {
    this.urlExtractor = new UrlExtractor();
    this.downloadService = new DownloadService();
    this.setupUrlExtractor();
  }

  private setupUrlExtractor(): void {
    this.urlExtractor.registerPlatform("yandex", [
      {
        entity: "track",
        regex: /music\.yandex\.ru\/track\/(?<id>\d+)/,
        groupNames: ["id"],
      },
      {
        entity: "track",
        regex: /music\.yandex\.ru\/album\/(?<album>\d+)\/track\/(?<id>\d+)/,
        groupNames: ["album", "id"],
      },
      {
        entity: "album",
        regex: /music\.yandex\.ru\/album\/(?<id>\d+)/,
        groupNames: ["id"],
      },
      {
        entity: "artist",
        regex: /music\.yandex\.ru\/artist\/(?<id>\d+)/,
        groupNames: ["id"],
      },
      {
        entity: "playlist",
        regex: /music\.yandex\.ru\/users\/(?<user>[\w\d\-_.]+)\/playlists\/(?<id>\d+)/,
        groupNames: ["id", "user"],
      },
      {
        entity: "playlist",
        regex: /music\.yandex\.ru\/playlists?\/(?<uid>(?:ar\.)?[A-Za-z0-9-]+)/,
        groupNames: ["uid"],
      },
    ]);
  }

  init(config: ApiInitConfig): Promise<InitResponse> {
    return this.api.init(config);
  }

  getApi(): YMApi {
    return this.api;
  }

  private extractNumericId(input: string, entity: string): number {
    const extracted = this.urlExtractor.extractId(input, entity, "yandex");
    const id = extracted.id;
    if (id === undefined) throw new ExtractionError(entity, input);
    return typeof id === "string" ? parseInt(id, 10) : id;
  }

  private getTrackId(track: TrackUrl | TrackId): TrackId {
    if (typeof track !== "string") return track;
    const extracted = this.urlExtractor.extractId<number>(track, "track", "yandex");
    const id = extracted.id ?? extracted.trackId;
    if (id === undefined) throw new ExtractionError("trackId", track);
    return id;
  }

  private getAlbumId(album: AlbumId | AlbumUrl): AlbumId {
    return typeof album === "string" ? this.extractNumericId(album, "album") : album;
  }

  private getArtistId(artist: ArtistId | ArtistUrl): ArtistId {
    return typeof artist === "string" ? this.extractNumericId(artist, "artist") : artist;
  }

  private getPlaylistId(
    playlist: PlaylistId | PlaylistUrl,
    user?: UserId | UserName,
  ): PlaylistIdentifier {
    const userStr = user ? String(user) : null;

    if (typeof playlist !== "string") {
      return { id: playlist, user: userStr };
    }

    const extracted = this.urlExtractor.extractId(playlist, "playlist", "yandex");

    if ("uid" in extracted) {
      return { id: extracted.uid, user: null };
    }

    if ("id" in extracted) {
      return {
        id: extracted.id,
        user: extracted.user ? String(extracted.user) : null,
      };
    }

    return { id: playlist, user: userStr };
  }

  async getDownloadInfo(
    track: TrackId | TrackUrl,
    options: DownloadOptions = {},
  ): Promise<DecryptedDownloadInfo> {
    const {
      codec = DTC.MP3,
      quality = "lossless" as DownloadTrackQuality,
      forceRaw = false,
    } = options;

    const config = CODEC_CONFIG[codec];
    const transport = forceRaw ? "raw" : config.transport;
    const encrypted = forceRaw ? false : config.encrypted;

    const response = await this.api.tracks.getTrackDownloadInfoNew(
      this.getTrackId(track),
      quality,
      config.codecs,
      transport,
    );

    return this.downloadService.getDownloadInfo(response, track, codec, quality, encrypted);
  }

  async getDownloadUrl(track: TrackId | TrackUrl, options: DownloadOptions = {}): Promise<string> {
    const info = await this.getDownloadInfo(track, options);
    return info.decryptedUrl ?? info.downloadInfoUrl;
  }

  async getDownloadUrlForFFmpeg(
    track: TrackId | TrackUrl,
    quality = "lossless" as DownloadTrackQuality,
  ): Promise<string | null> {
    try {
      return await this.getDownloadUrl(track, {
        codec: DTC.MP3,
        quality,
        forceRaw: true,
      });
    } catch {
      return null;
    }
  }

  async getBestDownloadUrl(
    track: TrackId | TrackUrl,
    quality = "lossless" as DownloadTrackQuality,
  ): Promise<string | null> {
    for (const codec of [
      DTC.FLACMP4,
      DTC.FLAC,
      DTC.AACMP4,
      DTC.AAC,
      DTC.HEACCMP4,
      DTC.HEACC,
      DTC.MP3,
    ] as const) {
      try {
        return await this.getDownloadUrl(track, { codec, quality });
      } catch {
        continue;
      }
    }
    return null;
  }

  isEncryptedUrl(url: string): boolean {
    return this.downloadService.isEncryptedUrl(url);
  }

  private createDownloadInfoGetter(codec: DTC, forceRaw = false) {
    return (track: TrackId | TrackUrl, quality = "lossless" as DownloadTrackQuality) =>
      this.getDownloadInfo(track, { codec, quality, forceRaw });
  }

  private createDownloadUrlGetter(codec: DTC, forceRaw = false) {
    return (track: TrackId | TrackUrl, quality = "lossless" as DownloadTrackQuality) =>
      this.getDownloadUrl(track, { codec, quality, forceRaw });
  }

  getMp3DownloadInfo = this.createDownloadInfoGetter(DTC.MP3, true);
  getAacDownloadInfo = this.createDownloadInfoGetter(DTC.AAC);
  getFlacDownloadInfo = this.createDownloadInfoGetter(DTC.FLAC);
  getFlacMP4DownloadInfo = this.createDownloadInfoGetter(DTC.FLACMP4);

  getMp3DownloadUrl = this.createDownloadUrlGetter(DTC.MP3, true);
  getAacDownloadUrl = this.createDownloadUrlGetter(DTC.AAC);
  getFlacDownloadUrl = this.createDownloadUrlGetter(DTC.FLAC);
  getFlacMP4DownloadUrl = this.createDownloadUrlGetter(DTC.FLACMP4);

  getPlaylist(playlist: PlaylistId | PlaylistUrl, user?: UserId | UserName): Promise<Playlist> {
    const { id, user: extractedUser } = this.getPlaylistId(playlist, user);
    return typeof id === "number"
      ? this.api.playlists.getPlaylist(id, extractedUser)
      : this.api.playlists.getPlaylist(id);
  }

  getTrack(track: TrackId | TrackUrl): Promise<Track> {
    return this.api.tracks.getSingleTrack(this.getTrackId(track));
  }

  getAlbum(album: AlbumId | AlbumUrl, withTracks = false): Promise<Album | AlbumWithTracks> {
    return this.api.albums.getAlbum(this.getAlbumId(album), withTracks);
  }

  getAlbumWithTracks(album: AlbumId | AlbumUrl): Promise<AlbumWithTracks> {
    return this.api.albums.getAlbumWithTracks(this.getAlbumId(album));
  }

  getArtist(artist: ArtistId | ArtistUrl): Promise<FilledArtist> {
    return this.api.artists.getArtist(this.getArtistId(artist));
  }
}

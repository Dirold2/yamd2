import type {
  TrackId,
  GetTrackResponse,
  Track,
  GetTrackSupplementResponse,
  SimilarTracksResponse,
  GetTrackDownloadInfoResponse,
  FileInfoResponseNew,
  Codecs,
  Transport,
  TrackLyrics,
  TrackTrailer,
  TrackFullInfo,
} from "../Types/index.js";
import {
  TrackNotFoundError,
  DownloadInfoError,
  InvalidUrlError,
  DownloadTrackQuality,
} from "../Types/index.js";
import shortenLink from "../ClckApi.js";
import { directLinkRequest } from "../PreparedRequest/index.js";
import { ApiContext } from "./ApiContext.js";

export class TrackApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /tracks/{trackId}
   * @ru Получить треки по ID.
   * @en Get tracks by ID.
   * @param trackId  Track ID (number or string).
   * @returns Promise with an array of tracks.
   */
  getTrack(trackId: TrackId): Promise<GetTrackResponse> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}`), "json");
  }

  /**
   * POST: /tracks
   * @ru Получить несколько треков по их ID.
   * @en Get multiple tracks by IDs.
   * @param trackIds  Array of track IDs.
   * @returns Promise with an array of tracks.
   */
  getTracks(trackIds: TrackId[]): Promise<Track[]> {
    return this.ctx.post(
      this.ctx.createRequest("/tracks").setBodyData({ trackIds: trackIds.join() }),
    );
  }

  /**
   * GET: /tracks/{trackId}
   * @ru Получить один трек по ID (обёртка над getTrack).
   * @en Get a single track by ID (wrapper around getTrack).
   * @param trackId  Track ID.
   * @returns Promise with a single track.
   */
  async getSingleTrack(trackId: TrackId): Promise<Track> {
    const tracks = await this.getTrack(trackId);
    if (!tracks?.length) throw new TrackNotFoundError(trackId);
    return tracks[0];
  }

  /**
   * GET: /tracks/{trackId}/supplement
   * @ru Получить дополнение к треку (связанный контент).
   * @en Get track supplement (related content).
   * @param trackId  Track ID.
   * @returns Promise with supplement.
   */
  getTrackSupplement(trackId: TrackId): Promise<GetTrackSupplementResponse> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/supplement`));
  }

  /**
   * GET: /tracks/{trackId}/similar
   * @ru Получить похожие треки.
   * @en Get similar tracks.
   * @param trackId  Track ID.
   * @returns Promise with similar tracks.
   */
  getSimilarTracks(trackId: TrackId): Promise<SimilarTracksResponse> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/similar`));
  }

  /**
   * GET: /tracks/{trackId}/lyrics
   * @ru Получить текст трека.
   * @en Get track lyrics.
   * @param trackId  Track ID.
   * @param format  Lyrics format (TEXT, LRC).
   * @returns Promise with lyrics.
   */
  getTrackLyrics(trackId: TrackId, format = "TEXT"): Promise<TrackLyrics> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/lyrics`).addQuery({ format }));
  }

  /**
   * GET: /tracks/{trackId}/trailer
   * @ru Получить трейлер трека.
   * @en Get track trailer.
   * @param trackId  Track ID.
   * @returns Promise with trailer.
   */
  getTrackTrailer(trackId: TrackId): Promise<TrackTrailer> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/trailer`));
  }

  /**
   * GET: /tracks/{trackId}/full-info
   * @ru Получить полную информацию о треке.
   * @en Get full track info.
   * @param trackId  Track ID.
   * @returns Promise with full info.
   */
  getTrackFullInfo(trackId: TrackId): Promise<TrackFullInfo> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/full-info`));
  }

  /**
   * GET: /tracks/{trackId}/download-info
   * @ru Получить информацию о загрузке трека.
   * @en Get track download info.
   * @param trackId  Track ID.
   * @param quality  Quality (LOW, MEDIUM, HIGH, Lossless).
   * @param canUseStreaming  Allow streaming.
   * @returns Promise with download info.
   */
  async getTrackDownloadInfo(
    trackId: TrackId,
    quality = DownloadTrackQuality.Lossless,
    canUseStreaming = true,
  ): Promise<GetTrackDownloadInfoResponse> {
    const ts = Math.floor(Date.now() / 1000);
    const sign = this.ctx.generateTrackSignature(ts, String(trackId), quality, "mp3", "raw");

    return this.ctx.get(
      this.ctx.createRequest(`/tracks/${trackId}/download-info`).addQuery({
        ts: String(ts),
        can_use_streaming: String(canUseStreaming),
        sign,
      }),
      "json",
    );
  }

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
  async getTrackDownloadInfoNew(
    trackId: number,
    quality = DownloadTrackQuality.Lossless,
    codecs: Codecs = "flac,aac,he-aac,mp3,flac-mp4,aac-mp4,he-aac-mp4",
    transport: Transport = "encraw",
  ): Promise<FileInfoResponseNew> {
    this.ctx.assertAuthenticated();

    const offset = await this.ctx.getYandexServerOffset();
    const ts = Math.floor(Date.now() / 1000 + offset);
    const sign = this.ctx.generateTrackSignature(ts, String(trackId), quality, codecs, transport);

    return this.ctx.get(
      this.ctx
        .createRequest("/get-file-info")
        .addHeaders(this.ctx.deviceHeader)
        .addHeaders({ "User-Agent": "YandexMusicDesktopAppWindows/5.23.2" })
        .addQuery({
          ts: String(ts),
          trackId: String(trackId),
          quality,
          codecs,
          transports: transport,
          sign,
        }),
    );
  }

  /**
   * GET: download URL
   * @ru Получить прямую ссылку на скачивание трека.
   * @en Get a direct download link for a track.
   * @param trackDownloadUrl  Download URL from getTrackDownloadInfo.
   * @param short  Shorten link via clck.ru.
   * @returns Promise with direct link.
   */
  async getTrackDirectLink(trackDownloadUrl: string, short = false): Promise<string> {
    const request = directLinkRequest(trackDownloadUrl);
    const rawResponse = await this.ctx.httpClient.get<any>(request, "xml");

    const downloadInfo = rawResponse["download-info"];
    if (!downloadInfo) throw new DownloadInfoError("Download info missing in response");

    const link = ApiContext.createTrackDirectLink(downloadInfo);
    return short ? shortenLink(link) : link;
  }

  /**
   * @ru Вернуть URL трека как есть (заглушка).
   * @en Return track URL as-is (passthrough).
   * @param trackUrl  Track URL.
   * @returns URL unchanged.
   */
  getTrackDirectLinkNew(trackUrl: string): string {
    return trackUrl;
  }

  /**
   * @ru Извлечь ID трека из URL.
   * @en Extract track ID from a URL.
   * @param url  URL like https://music.yandex.ru/album/{albumId}/track/{trackId}.
   * @returns Track ID.
   */
  extractTrackId(url: string): string {
    const match = url.match(/\/track\/(\d+)/);
    if (!match) throw new InvalidUrlError(url);
    return match[1];
  }

  /**
   * @ru Получить ссылку на трек для шаринга.
   * @en Get a shareable link for a track.
   * @param track  Track ID or Track object.
   * @returns Promise with share URL.
   */
  async getTrackShareLink(track: TrackId | Track): Promise<string> {
    const [albumId, trackId] =
      typeof track === "object"
        ? [track.albums[0].id, track.id]
        : [(await this.getSingleTrack(track)).albums[0].id, Number(track)];

    return `https://music.yandex.ru/album/${albumId}/track/${trackId}`;
  }
}

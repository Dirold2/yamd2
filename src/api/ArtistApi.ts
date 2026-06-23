import type {
  ArtistId,
  Artist,
  FilledArtist,
  ArtistTracksResponse,
  SearchOptions,
  ArtistBriefInfo,
  ArtistAlbumsResponse,
  ArtistSimilar,
  ArtistLinks,
  ArtistAbout,
  ArtistClips,
  ArtistDonations,
  ArtistInfo,
  ArtistSkeleton,
  ArtistTrailer,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class ArtistApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /artists/{artistId}
   * @ru Получить информацию об артисте.
   * @en Get artist info.
   * @param artistId  Artist ID.
   * @returns Promise with full artist info.
   */
  getArtist(artistId: ArtistId): Promise<FilledArtist> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}`));
  }

  /**
   * POST: /artists
   * @ru Получить нескольких артистов по их ID.
   * @en Get multiple artists by IDs.
   * @param artistIds  Array of artist IDs.
   * @returns Promise with an array of artists.
   */
  getArtists(artistIds: ArtistId[]): Promise<Artist[]> {
    return this.ctx.post(
      this.ctx.createRequest("/artists").setBodyData({
        artistIds: artistIds.join(),
      }),
    );
  }

  /**
   * GET: /artists/{artistId}/tracks
   * @ru Получить треки артиста.
   * @en Get artist tracks.
   * @param artistId  Artist ID.
   * @param options  Pagination options (page, pageSize).
   * @returns Promise with artist tracks.
   */
  getArtistTracks(artistId: ArtistId, options: SearchOptions = {}): Promise<ArtistTracksResponse> {
    const request = this.ctx.createRequest(`/artists/${artistId}/tracks`).setQuery({
      page: String(options.page ?? 0),
    });

    if (options.pageSize !== undefined) {
      request.addQuery({ pageSize: String(options.pageSize) });
    }

    return this.ctx.get(request);
  }

  /**
   * GET: /artists/{artistId}/brief-info
   * @ru Получить краткую информацию об артисте (альбомы, похожие, ссылки).
   * @en Get brief artist info (albums, similar artists, links).
   * @param artistId  Artist ID.
   * @returns Promise with brief info.
   */
  getArtistBriefInfo(artistId: ArtistId): Promise<ArtistBriefInfo> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/brief-info`));
  }

  /**
   * GET: /artists/{artistId}/direct-albums
   * @ru Получить прямые альбомы артиста.
   * @en Get artist direct albums.
   * @param artistId  Artist ID.
   * @param options  Pagination and sort options.
   * @returns Promise with albums.
   */
  getArtistDirectAlbums(
    artistId: ArtistId,
    options: { page?: number; pageSize?: number; sortBy?: string } = {},
  ): Promise<ArtistAlbumsResponse> {
    const req = this.ctx.createRequest(`/artists/${artistId}/direct-albums`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ "page-size": String(options.pageSize) });
    if (options.sortBy !== undefined) req.addQuery({ "sort-by": options.sortBy });
    return this.ctx.get(req);
  }

  /**
   * GET: /artists/{artistId}/similar
   * @ru Получить похожих артистов.
   * @en Get similar artists.
   * @param artistId  Artist ID.
   * @returns Promise with similar artists.
   */
  getArtistSimilar(artistId: ArtistId): Promise<ArtistSimilar> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/similar`));
  }

  /**
   * GET: /artists/{artistId}/artist-links
   * @ru Получить ссылки артиста (сайты, соцсети).
   * @en Get artist links (websites, social media).
   * @param artistId  Artist ID.
   * @returns Promise with links.
   */
  getArtistLinks(artistId: ArtistId): Promise<ArtistLinks> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/artist-links`));
  }

  /**
   * GET: /artists/{artistId}/also-albums
   * @ru Получить альбомы "также" (коллаборации, сборники).
   * @en Get "also" albums (collaborations, compilations).
   * @param artistId  Artist ID.
   * @param options  Pagination and sort options.
   * @returns Promise with albums.
   */
  getArtistAlsoAlbums(
    artistId: ArtistId,
    options: { page?: number; pageSize?: number; sortBy?: string } = {},
  ): Promise<ArtistAlbumsResponse> {
    const req = this.ctx.createRequest(`/artists/${artistId}/also-albums`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ "page-size": String(options.pageSize) });
    if (options.sortBy !== undefined) req.addQuery({ "sort-by": options.sortBy });
    return this.ctx.get(req);
  }

  /**
   * GET: /artists/{artistId}/discography-albums
   * @ru Получить дискографию артиста.
   * @en Get artist discography albums.
   * @param artistId  Artist ID.
   * @param options  Pagination and sort options.
   * @returns Promise with albums.
   */
  getArtistDiscographyAlbums(
    artistId: ArtistId,
    options: { page?: number; pageSize?: number; sortBy?: string } = {},
  ): Promise<ArtistAlbumsResponse> {
    const req = this.ctx.createRequest(`/artists/${artistId}/discography-albums`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ "page-size": String(options.pageSize) });
    if (options.sortBy !== undefined) req.addQuery({ "sort-by": options.sortBy });
    return this.ctx.get(req);
  }

  /**
   * GET: /artists/{artistId}/safe-direct-albums
   * @ru Получить безопасные прямые альбомы.
   * @en Get safe direct albums.
   * @param artistId  Artist ID.
   * @param options  Sort and limit options.
   * @returns Promise with albums.
   */
  getArtistSafeDirectAlbums(
    artistId: ArtistId,
    options: { sortBy?: string; sortOrder?: string; limit?: number } = {},
  ): Promise<ArtistAlbumsResponse> {
    const req = this.ctx.createRequest(`/artists/${artistId}/safe-direct-albums`);
    if (options.sortBy !== undefined) req.addQuery({ "sort-by": options.sortBy });
    if (options.sortOrder !== undefined) req.addQuery({ "sort-order": options.sortOrder });
    if (options.limit !== undefined) req.addQuery({ limit: String(options.limit) });
    return this.ctx.get(req);
  }

  /**
   * GET: /artists/{artistId}/track-ids
   * @ru Получить ID треков артиста.
   * @en Get artist track IDs.
   * @param artistId  Artist ID.
   * @param options  Pagination options.
   * @returns Promise with an array of track IDs.
   */
  getArtistTrackIds(
    artistId: ArtistId,
    options: { page?: number; pageSize?: number } = {},
  ): Promise<string[]> {
    const req = this.ctx.createRequest(`/artists/${artistId}/track-ids`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ "page-size": String(options.pageSize) });
    return this.ctx.get(req);
  }

  /**
   * GET: /artists/{artistId}/about-artist
   * @ru Получить описание артиста.
   * @en Get artist description.
   * @param artistId  Artist ID.
   * @returns Promise with description.
   */
  getArtistAbout(artistId: ArtistId): Promise<ArtistAbout> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/about-artist`));
  }

  /**
   * GET: /artists/{artistId}/blocks/artist-clips
   * @ru Получить клипы артиста.
   * @en Get artist clips.
   * @param artistId  Artist ID.
   * @returns Promise with clips.
   */
  getArtistClips(artistId: ArtistId): Promise<ArtistClips> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/blocks/artist-clips`));
  }

  /**
   * GET: /artists/{artistId}/blocks/artist-donation
   * @ru Получить информацию о донатах артиста.
   * @en Get artist donation info.
   * @param artistId  Artist ID.
   * @returns Promise with donation info.
   */
  getArtistDonation(artistId: ArtistId): Promise<ArtistDonations> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/blocks/artist-donation`));
  }

  /**
   * GET: /artists/{artistId}/info
   * @ru Получить расширенную информацию об артисте.
   * @en Get extended artist info.
   * @param artistId  Artist ID.
   * @returns Promise with info.
   */
  getArtistInfo(artistId: ArtistId): Promise<ArtistInfo> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/info`));
  }

  /**
   * GET: /artists/{artistId}/skeletons/{skeletonId}
   * @ru Получить скелет (структуру) страницы артиста.
   * @en Get artist page skeleton.
   * @param artistId  Artist ID.
   * @param skeletonId  Skeleton ID (default: web-artist-default).
   * @returns Promise with skeleton.
   */
  getArtistSkeleton(
    artistId: ArtistId,
    skeletonId = "web-artist-default",
  ): Promise<ArtistSkeleton> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/skeletons/${skeletonId}`));
  }

  /**
   * GET: /artists/{artistId}/trailer
   * @ru Получить трейлер артиста.
   * @en Get artist trailer.
   * @param artistId  Artist ID.
   * @returns Promise with trailer.
   */
  getArtistTrailer(artistId: ArtistId): Promise<ArtistTrailer> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/trailer`));
  }
}

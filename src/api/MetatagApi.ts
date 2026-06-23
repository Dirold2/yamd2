import type {
  Metatag,
  MetatagsResponse,
  MetatagAlbumsResponse,
  MetatagArtistsResponse,
  MetatagPlaylistsResponse,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

type MetatreeRequest = { type: string; id: string | number };

export class MetatagApi {
  constructor(private ctx: ApiContext) {}

  /**
   * POST: /metatags
   * @ru Получить метатеги для сущностей или все деревья метатегов.
   * @en Get metatags for entities or all metatag trees.
   * @param requests  Array of requests with entity types and IDs (optional).
   * @returns Promise with metatag trees.
   */
  getMetatags(_requests: MetatreeRequest[] = []): Promise<MetatagsResponse> {
    return this.ctx.getRaw(this.ctx.createRequest("/metatags"));
  }

  /**
   * GET: /metatag/{tag}
   * @ru Получить метатег с контентом (треки, альбомы, артисты, плейлисты).
   * @en Get metatag with content (tracks, albums, artists, playlists).
   * @param tag  Tag name.
   * @param options  Options (tracksCount, etc.).
   * @returns Promise with metatag.
   */
  getMetatag(tag: string, options: { tracksCount?: number } = {}): Promise<Metatag> {
    const req = this.ctx.createRequest(`/metatag/${tag}`);
    if (options.tracksCount !== undefined) {
      req.addQuery({ tracksCount: String(options.tracksCount) });
    }
    return this.ctx.get(req);
  }

  /**
   * GET: /metatag/{tag}/albums
   * @ru Получить альбомы метатега.
   * @en Get metatag albums.
   * @param tag  Tag name.
   * @param options  Pagination options.
   * @returns Promise with albums.
   */
  getMetatagAlbums(
    tag: string,
    options: { page?: number; pageSize?: number } = {},
  ): Promise<MetatagAlbumsResponse> {
    const req = this.ctx.createRequest(`/metatag/${tag}/albums`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ pageSize: String(options.pageSize) });
    return this.ctx.get(req);
  }

  /**
   * GET: /metatag/{tag}/artists
   * @ru Получить артистов метатега.
   * @en Get metatag artists.
   * @param tag  Tag name.
   * @param options  Pagination options.
   * @returns Promise with artists.
   */
  getMetatagArtists(
    tag: string,
    options: { page?: number; pageSize?: number } = {},
  ): Promise<MetatagArtistsResponse> {
    const req = this.ctx.createRequest(`/metatag/${tag}/artists`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ pageSize: String(options.pageSize) });
    return this.ctx.get(req);
  }

  /**
   * GET: /metatag/{tag}/playlists
   * @ru Получить плейлисты метатега.
   * @en Get metatag playlists.
   * @param tag  Tag name.
   * @param options  Pagination options.
   * @returns Promise with playlists.
   */
  getMetatagPlaylists(
    tag: string,
    options: { page?: number; pageSize?: number } = {},
  ): Promise<MetatagPlaylistsResponse> {
    const req = this.ctx.createRequest(`/metatag/${tag}/playlists`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ pageSize: String(options.pageSize) });
    return this.ctx.get(req);
  }
}

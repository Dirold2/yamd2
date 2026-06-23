import type {
  SearchOptions,
  SearchResponseMap,
  SearchType,
  SearchAllResponse,
  SearchArtistsResponse,
  SearchTracksResponse,
  SearchAlbumsResponse,
  ConcreteSearchOptions,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class SearchApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /search
   * @ru Выполнить поиск по тексту.
   * @en Search by query text.
   * @param q  Query text.
   * @param options  Search options (type, page, pageSize, nocorrect).
   * @returns Promise with search results.
   */
  async query<T extends SearchType = "all">(
    q: string,
    options: SearchOptions & { type?: T } = {},
  ): Promise<SearchResponseMap[T]> {
    const request = this.ctx.createRequest("/search").setQuery({
      type: options.type ?? "all",
      text: q,
      page: String(options.page ?? 0),
      nocorrect: String(options.nocorrect ?? false),
    });

    if (options.pageSize !== undefined) {
      request.addQuery({ pageSize: String(options.pageSize) });
    }

    return this.ctx.get<SearchResponseMap[T]>(request);
  }

  /**
   * GET: /search?type=artist
   * @ru Поиск артистов.
   * @en Search artists.
   * @param q  Query text.
   * @param options  Search options.
   * @returns Promise with artists.
   */
  artists(q: string, options: ConcreteSearchOptions = {}): Promise<SearchArtistsResponse> {
    return this.query(q, { ...options, type: "artist" });
  }

  /**
   * GET: /search?type=track
   * @ru Поиск треков.
   * @en Search tracks.
   * @param q  Query text.
   * @param options  Search options.
   * @returns Promise with tracks.
   */
  tracks(q: string, options: ConcreteSearchOptions = {}): Promise<SearchTracksResponse> {
    return this.query(q, { ...options, type: "track" });
  }

  /**
   * GET: /search?type=album
   * @ru Поиск альбомов.
   * @en Search albums.
   * @param q  Query text.
   * @param options  Search options.
   * @returns Promise with albums.
   */
  albums(q: string, options: ConcreteSearchOptions = {}): Promise<SearchAlbumsResponse> {
    return this.query(q, { ...options, type: "album" });
  }

  /**
   * GET: /search?type=all
   * @ru Поиск по всем типам.
   * @en Search all types.
   * @param q  Query text.
   * @param options  Search options.
   * @returns Promise with all results.
   */
  all(q: string, options: ConcreteSearchOptions = {}): Promise<SearchAllResponse> {
    return this.query(q, { ...options, type: "all" });
  }
}

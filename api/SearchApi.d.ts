import type { SearchOptions, SearchResponseMap, SearchType, SearchAllResponse, SearchArtistsResponse, SearchTracksResponse, SearchAlbumsResponse, ConcreteSearchOptions } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class SearchApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /search
     * @ru Выполнить поиск по тексту.
     * @en Search by query text.
     * @param q  Query text.
     * @param options  Search options (type, page, pageSize, nocorrect).
     * @returns Promise with search results.
     */
    query<T extends SearchType = "all">(q: string, options?: SearchOptions & {
        type?: T;
    }): Promise<SearchResponseMap[T]>;
    /**
     * GET: /search?type=artist
     * @ru Поиск артистов.
     * @en Search artists.
     * @param q  Query text.
     * @param options  Search options.
     * @returns Promise with artists.
     */
    artists(q: string, options?: ConcreteSearchOptions): Promise<SearchArtistsResponse>;
    /**
     * GET: /search?type=track
     * @ru Поиск треков.
     * @en Search tracks.
     * @param q  Query text.
     * @param options  Search options.
     * @returns Promise with tracks.
     */
    tracks(q: string, options?: ConcreteSearchOptions): Promise<SearchTracksResponse>;
    /**
     * GET: /search?type=album
     * @ru Поиск альбомов.
     * @en Search albums.
     * @param q  Query text.
     * @param options  Search options.
     * @returns Promise with albums.
     */
    albums(q: string, options?: ConcreteSearchOptions): Promise<SearchAlbumsResponse>;
    /**
     * GET: /search?type=all
     * @ru Поиск по всем типам.
     * @en Search all types.
     * @param q  Query text.
     * @param options  Search options.
     * @returns Promise with all results.
     */
    all(q: string, options?: ConcreteSearchOptions): Promise<SearchAllResponse>;
}

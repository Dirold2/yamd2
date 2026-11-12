import type { AlbumId, Album, AlbumWithTracks, AlbumSimilarEntities, AlbumTrailer } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class AlbumApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /albums/{albumId}[?with-tracks]
     * @ru Получить альбом по ID. Если withTracks=true, включает треки.
     * @en Get album by ID. If withTracks=true, includes tracks.
     * @param albumId  Album ID.
     * @param withTracks  Include tracks in response.
     * @returns Promise with album.
     */
    getAlbum(albumId: AlbumId, withTracks?: boolean): Promise<Album | AlbumWithTracks>;
    /**
     * GET: /albums/{albumId}/with-tracks
     * @ru Получить альбом с треками.
     * @en Get album with tracks (volumes).
     * @param albumId  Album ID.
     * @returns Promise with album and tracks.
     */
    getAlbumWithTracks(albumId: AlbumId): Promise<AlbumWithTracks>;
    /**
     * POST: /albums
     * @ru Получить несколько альбомов по их ID.
     * @en Get multiple albums by IDs.
     * @param albumIds  Array of album IDs.
     * @returns Promise with an array of albums.
     */
    getAlbums(albumIds: AlbumId[]): Promise<Album[]>;
    /**
     * GET: /albums/{albumId}/similar-entities
     * @ru Получить похожие сущности для альбома.
     * @en Get similar entities for an album.
     * @param albumId  Album ID.
     * @returns Promise with similar entities.
     */
    getAlbumSimilarEntities(albumId: AlbumId): Promise<AlbumSimilarEntities>;
    /**
     * GET: /albums/{albumId}/trailer
     * @ru Получить трейлер альбома.
     * @en Get album trailer.
     * @param albumId  Album ID.
     * @returns Promise with album trailer.
     */
    getAlbumTrailer(albumId: AlbumId): Promise<AlbumTrailer>;
}

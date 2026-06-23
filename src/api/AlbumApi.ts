import type {
  AlbumId,
  Album,
  AlbumWithTracks,
  AlbumSimilarEntities,
  AlbumTrailer,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class AlbumApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /albums/{albumId}[?with-tracks]
   * @ru Получить альбом по ID. Если withTracks=true, включает треки.
   * @en Get album by ID. If withTracks=true, includes tracks.
   * @param albumId  Album ID.
   * @param withTracks  Include tracks in response.
   * @returns Promise with album.
   */
  getAlbum(albumId: AlbumId, withTracks = false): Promise<Album | AlbumWithTracks> {
    const path = withTracks ? `/albums/${albumId}/with-tracks` : `/albums/${albumId}`;
    return this.ctx.get(this.ctx.createRequest(path));
  }

  /**
   * GET: /albums/{albumId}/with-tracks
   * @ru Получить альбом с треками.
   * @en Get album with tracks (volumes).
   * @param albumId  Album ID.
   * @returns Promise with album and tracks.
   */
  getAlbumWithTracks(albumId: AlbumId): Promise<AlbumWithTracks> {
    return this.getAlbum(albumId, true) as Promise<AlbumWithTracks>;
  }

  /**
   * POST: /albums
   * @ru Получить несколько альбомов по их ID.
   * @en Get multiple albums by IDs.
   * @param albumIds  Array of album IDs.
   * @returns Promise with an array of albums.
   */
  getAlbums(albumIds: AlbumId[]): Promise<Album[]> {
    return this.ctx.post(
      this.ctx.createRequest("/albums").setBodyData({ albumIds: albumIds.join() }),
    );
  }

  /**
   * GET: /albums/{albumId}/similar-entities
   * @ru Получить похожие сущности для альбома.
   * @en Get similar entities for an album.
   * @param albumId  Album ID.
   * @returns Promise with similar entities.
   */
  getAlbumSimilarEntities(albumId: AlbumId): Promise<AlbumSimilarEntities> {
    return this.ctx.get(this.ctx.createRequest(`/albums/${albumId}/similar-entities`));
  }

  /**
   * GET: /albums/{albumId}/trailer
   * @ru Получить трейлер альбома.
   * @en Get album trailer.
   * @param albumId  Album ID.
   * @returns Promise with album trailer.
   */
  getAlbumTrailer(albumId: AlbumId): Promise<AlbumTrailer> {
    return this.ctx.get(this.ctx.createRequest(`/albums/${albumId}/trailer`));
  }
}

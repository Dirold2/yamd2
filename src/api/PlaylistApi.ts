import type {
  Playlist,
  PlaylistRecommendations,
  PlaylistTrailer,
  PlaylistSimilarEntities,
  UserSettings,
} from "../Types/index.js";
import { YMApiError } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

type UserIdParam = number | string | null;

export class PlaylistApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /users/{userId}/playlists/list
   * @ru Получить список плейлистов пользователя.
   * @en Get user playlists list.
   * @param userId  User ID (null for current user).
   * @returns Promise with an array of playlists.
   */
  getUserPlaylists(userId: UserIdParam = null): Promise<Playlist[]> {
    const uid = this.ctx.resolveUserId(userId);
    return this.ctx.get(this.ctx.createRequest(`/users/${uid}/playlists/list`));
  }

  /**
   * GET: /users/{userId}/playlists/{playlistId} or /playlist/{kind}
   * @ru Получить плейлист по ID/виду. Для числового ID — по пользователю; для строкового — по kind.
   * @en Get playlist by ID/kind. Numeric ID resolves via user; string kind resolves directly.
   * @param playlistId  Playlist kind (string) or ID (number).
   * @param user  User ID (only for numeric playlistId).
   * @returns Promise with playlist.
   */
  getPlaylist(playlistId: number, user?: UserIdParam): Promise<Playlist>;
  getPlaylist(playlistId: string): Promise<Playlist>;
  getPlaylist(playlistId: number | string, user: UserIdParam = null): Promise<Playlist> {
    if (typeof playlistId === "number") {
      const uid = this.ctx.resolveUserId(user);
      return this.ctx.get(this.ctx.createRequest(`/users/${uid}/playlists/${playlistId}`));
    }

    const normalizedId = playlistId.replace("/playlists/", "/playlist/");
    return this.ctx.get(
      this.ctx.createRequest(`/playlist/${normalizedId}`).addQuery({
        richTracks: "true",
      }),
    );
  }

  /**
   * GET: /playlist/{kind} (via getPlaylist)
   * @ru Получить новый плейлист по kind (строка).
   * @en Get new playlist by kind (string).
   * @param playlistId  Playlist kind.
   * @returns Promise with playlist.
   */
  getPlaylistNew(playlistId: string): Promise<Playlist> {
    return this.getPlaylist(playlistId);
  }

  /**
   * POST: /users/{userId}/playlists
   * @ru Получить несколько плейлистов по их kinds.
   * @en Get multiple playlists by their kinds.
   * @param playlists  Array of playlist kinds.
   * @param user  User ID.
   * @param options  Options (mixed, rich-tracks).
   * @returns Promise with an array of playlists.
   */
  getPlaylists(
    playlists: number[],
    user: UserIdParam = null,
    options: { mixed?: boolean; "rich-tracks"?: boolean } = {},
  ): Promise<Playlist[]> {
    const uid = this.ctx.resolveUserId(user);
    return this.ctx.get(
      this.ctx.createRequest(`/users/${uid}/playlists`).setQuery({
        kinds: playlists.join(),
        mixed: String(options.mixed ?? false),
        "rich-tracks": String(options["rich-tracks"] ?? false),
      }),
      "xml",
    );
  }

  /**
   * POST: /users/{userId}/playlists/create
   * @ru Создать новый плейлист.
   * @en Create a new playlist.
   * @param name  Playlist name.
   * @param options  Visibility options.
   * @returns Promise with created playlist.
   */
  async createPlaylist(
    name: string,
    options: { visibility?: "public" | "private" } = {},
  ): Promise<Playlist> {
    if (!name) throw new YMApiError("Playlist name is required", "INVALID_INPUT");

    const body = new URLSearchParams({
      title: name,
      visibility: options.visibility ?? "private",
    });

    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${this.ctx.user.uid}/playlists/create`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
    );
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/delete
   * @ru Удалить плейлист.
   * @en Remove a playlist.
   * @param playlistId  Playlist ID.
   * @returns Promise with confirmation.
   */
  removePlaylist(playlistId: number): Promise<"ok" | string> {
    return this.ctx.post(
      this.ctx.createRequest(`/users/${this.ctx.user.uid}/playlists/${playlistId}/delete`),
    );
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/name
   * @ru Переименовать плейлист.
   * @en Rename a playlist.
   * @param playlistId  Playlist ID.
   * @param name  New name.
   * @returns Promise with updated playlist.
   */
  renamePlaylist(playlistId: number, name: string): Promise<Playlist> {
    const body = new URLSearchParams({ value: name });

    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${this.ctx.user.uid}/playlists/${playlistId}/name`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
    );
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/change-relative
   * @ru Добавить треки в плейлист.
   * @en Add tracks to a playlist.
   * @param playlistId  Playlist ID or kind.
   * @param tracks  Array of tracks with id and albumId.
   * @param revision  Current playlist revision.
   * @param options  Options (at position).
   * @returns Promise with updated playlist.
   */
  addTracksToPlaylist(
    playlistId: number | string,
    tracks: Array<{ id: number | string; albumId: number | string }>,
    revision: number,
    options: { at?: number } = {},
  ): Promise<Playlist> {
    const formattedTracks = tracks.map((t) => ({
      id: String(t.id),
      albumId: String(t.albumId),
    }));

    const diff = JSON.stringify([
      {
        op: "insert",
        at: options.at ?? 0,
        tracks: formattedTracks,
      },
    ]);

    const body = new URLSearchParams({
      diff: diff,
      revision: String(revision),
    });

    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${this.ctx.user.uid}/playlists/${playlistId}/change-relative`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
      "xml",
    );
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/change-relative
   * @ru Удалить треки из плейлиста.
   * @en Remove tracks from a playlist.
   * @param playlistId  Playlist ID.
   * @param tracks  Array of tracks to remove.
   * @param revision  Current playlist revision.
   * @param options  Range options (from, to).
   * @returns Promise with updated playlist.
   */
  removeTracksFromPlaylist(
    playlistId: number,
    tracks: Array<{ id: number; albumId: number }>,
    revision: number,
    options: { from?: number; to?: number } = {},
  ): Promise<Playlist> {
    const body = new URLSearchParams({
      diff: JSON.stringify([
        {
          op: "delete",
          from: options.from ?? 0,
          to: options.to ?? tracks.length,
          tracks,
        },
      ]),
      revision: String(revision),
    });

    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${this.ctx.user.uid}/playlists/${playlistId}/change-relative`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
    );
  }

  /**
   * GET: /users/{userId}/playlists/{kind}/recommendations
   * @ru Получить рекомендации для плейлиста.
   * @en Get playlist recommendations.
   * @param kind  Playlist kind.
   * @param userId  User ID.
   * @returns Promise with recommendations.
   */
  getPlaylistRecommendations(
    kind: number,
    userId: UserIdParam = null,
  ): Promise<PlaylistRecommendations> {
    const uid = this.ctx.resolveUserId(userId);
    return this.ctx.get(this.ctx.createRequest(`/users/${uid}/playlists/${kind}/recommendations`));
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/visibility
   * @ru Установить видимость плейлиста.
   * @en Set playlist visibility.
   * @param playlistId  Playlist ID.
   * @param visibility  Visibility (public/private).
   * @param userId  User ID.
   * @returns Promise with updated playlist.
   */
  setPlaylistVisibility(
    playlistId: number,
    visibility: "public" | "private",
    userId: UserIdParam = null,
  ): Promise<Playlist> {
    const uid = this.ctx.resolveUserId(userId);
    const body = new URLSearchParams({ value: visibility });
    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${uid}/playlists/${playlistId}/visibility`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
    );
  }

  /**
   * POST: /users/{userId}/playlists/{playlistId}/description
   * @ru Установить описание плейлиста.
   * @en Set playlist description.
   * @param playlistId  Playlist ID.
   * @param description  Description text.
   * @param userId  User ID.
   * @returns Promise with updated playlist.
   */
  setPlaylistDescription(
    playlistId: number,
    description: string,
    userId: UserIdParam = null,
  ): Promise<Playlist> {
    const uid = this.ctx.resolveUserId(userId);
    const body = new URLSearchParams({ value: description });
    return this.ctx.post(
      this.ctx
        .createRequest(`/users/${uid}/playlists/${playlistId}/description`)
        .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
        .setBodyData(body),
    );
  }

  /**
   * GET: /users/{userId}/playlists/list/kinds
   * @ru Получить все kinds плейлистов пользователя.
   * @en Get all playlist kinds for a user.
   * @param userId  User ID.
   * @returns Promise with an array of kinds.
   */
  getPlaylistKinds(userId: UserIdParam = null): Promise<number[]> {
    const uid = this.ctx.resolveUserId(userId);
    return this.ctx.get(this.ctx.createRequest(`/users/${uid}/playlists/list/kinds`));
  }

  /**
   * GET: /users/{userId}/playlists/{kind}/trailer
   * @ru Получить трейлер плейлиста.
   * @en Get playlist trailer.
   * @param kind  Playlist kind.
   * @param userId  User ID.
   * @returns Promise with trailer.
   */
  getPlaylistTrailer(kind: number, userId: UserIdParam = null): Promise<PlaylistTrailer> {
    const uid = this.ctx.resolveUserId(userId);
    return this.ctx.get(this.ctx.createRequest(`/users/${uid}/playlists/${kind}/trailer`));
  }

  /**
   * GET: /playlist/{playlistUuid}/similar-entities
   * @ru Получить похожие сущности для плейлиста.
   * @en Get similar entities for a playlist.
   * @param playlistUuid  Playlist UUID.
   * @returns Promise with similar entities.
   */
  getPlaylistSimilarEntities(playlistUuid: string): Promise<PlaylistSimilarEntities> {
    return this.ctx.get(this.ctx.createRequest(`/playlist/${playlistUuid}/similar-entities`));
  }

  /**
   * GET: /users/{userId}/settings
   * @ru Получить настройки пользователя.
   * @en Get user settings.
   * @param userId  User ID.
   * @returns Promise with settings.
   */
  getUserSettings(userId: UserIdParam = null): Promise<UserSettings> {
    const uid = this.ctx.resolveUserId(userId);
    return this.ctx.get(this.ctx.createRequest(`/users/${uid}/settings`));
  }

  /**
   * POST: /playlists/collective/join
   * @ru Присоединиться к коллективному плейлисту по токену.
   * @en Join a collective playlist by token.
   * @param userId  User ID.
   * @param token  Invite token.
   * @returns Promise with confirmation.
   */
  collectiveJoin(userId: number, token: string): Promise<"ok" | string> {
    return this.ctx.post(
      this.ctx.createRequest(`/playlists/collective/join`).addQuery({
        uid: String(userId),
        token,
      }),
    );
  }
}

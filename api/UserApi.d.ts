import type { DisOrLikedTracksResponse, LikeAlbumResponse, LikeArtistResponse, LikePlaylistResponse, LikeClipsResponse, LikeToggleResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
type UserIdParam = number | string | null;
export declare class UserApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /users/{userId}/likes/tracks
     * @ru Получить понравившиеся треки.
     * @en Get liked tracks.
     * @param userId  User ID (null for current user).
     * @returns Promise with tracks.
     */
    getLikedTracks(userId?: UserIdParam): Promise<DisOrLikedTracksResponse>;
    /**
     * POST: /users/{userId}/likes/tracks/add-multiple
     * @ru Добавить треки в понравившиеся.
     * @en Like tracks.
     * @param trackIds  Array of track IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    likeTracks(trackIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/likes/tracks/remove
     * @ru Убрать треки из понравившихся.
     * @en Unlike tracks.
     * @param trackIds  Array of track IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    unlikeTracks(trackIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/likes/albums
     * @ru Получить понравившиеся альбомы.
     * @en Get liked albums.
     * @param userId  User ID.
     * @returns Promise with albums.
     */
    getLikedAlbums(userId?: UserIdParam): Promise<LikeAlbumResponse>;
    /**
     * POST: /users/{userId}/likes/albums/add-multiple
     * @ru Добавить альбомы в понравившиеся.
     * @en Like albums.
     * @param albumIds  Array of album IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    likeAlbums(albumIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/likes/albums/remove
     * @ru Убрать альбомы из понравившихся.
     * @en Unlike albums.
     * @param albumIds  Array of album IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    unlikeAlbums(albumIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/likes/artists
     * @ru Получить понравившихся артистов.
     * @en Get liked artists.
     * @param userId  User ID.
     * @returns Promise with artists.
     */
    getLikedArtists(userId?: UserIdParam): Promise<LikeArtistResponse>;
    /**
     * POST: /users/{userId}/likes/artists/add-multiple
     * @ru Добавить артистов в понравившиеся.
     * @en Like artists.
     * @param artistIds  Array of artist IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    likeArtists(artistIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/likes/artists/remove
     * @ru Убрать артистов из понравившихся.
     * @en Unlike artists.
     * @param artistIds  Array of artist IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    unlikeArtists(artistIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/likes/playlists
     * @ru Получить понравившиеся плейлисты.
     * @en Get liked playlists.
     * @param userId  User ID.
     * @returns Promise with playlists.
     */
    getLikedPlaylists(userId?: UserIdParam): Promise<LikePlaylistResponse>;
    /**
     * POST: /users/{userId}/likes/playlists/add-multiple
     * @ru Добавить плейлисты в понравившиеся.
     * @en Like playlists.
     * @param playlistIds  Array of playlist IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    likePlaylists(playlistIds: string[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/likes/playlists/remove
     * @ru Убрать плейлисты из понравившихся.
     * @en Unlike playlists.
     * @param playlistIds  Array of playlist IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    unlikePlaylists(playlistIds: string[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/likes/clips
     * @ru Получить понравившиеся клипы.
     * @en Get liked clips.
     * @param userId  User ID.
     * @param page  Page number.
     * @param pageSize  Page size.
     * @returns Promise with clips.
     */
    getLikedClips(userId?: UserIdParam, page?: number, pageSize?: number): Promise<LikeClipsResponse>;
    /**
     * POST: /users/{userId}/likes/clips/add
     * @ru Добавить клип в понравившиеся.
     * @en Like a clip.
     * @param clipId  Clip ID.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    likeClip(clipId: number | string, userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/likes/clips/{clipId}/remove
     * @ru Убрать клип из понравившихся.
     * @en Unlike a clip.
     * @param clipId  Clip ID.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    unlikeClip(clipId: number | string, userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/dislikes/tracks
     * @ru Получить непонравившиеся треки.
     * @en Get disliked tracks.
     * @param userId  User ID.
     * @returns Promise with tracks.
     */
    getDislikedTracks(userId?: UserIdParam): Promise<DisOrLikedTracksResponse>;
    /**
     * POST: /users/{userId}/dislikes/tracks/add-multiple
     * @ru Добавить треки в непонравившиеся.
     * @en Dislike tracks.
     * @param trackIds  Array of track IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    dislikeTracks(trackIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/dislikes/tracks/remove
     * @ru Убрать треки из непонравившихся.
     * @en Undislike tracks.
     * @param trackIds  Array of track IDs.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    undislikeTracks(trackIds: (number | string)[], userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * GET: /users/{userId}/dislikes/artists
     * @ru Получить непонравившихся артистов.
     * @en Get disliked artists.
     * @param userId  User ID.
     * @returns Promise with artists.
     */
    getDislikedArtists(userId?: UserIdParam): Promise<LikeArtistResponse>;
    /**
     * POST: /users/{userId}/dislikes/artists/add-multiple
     * @ru Добавить артиста в непонравившиеся.
     * @en Dislike an artist.
     * @param artistId  Artist ID.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    dislikeArtist(artistId: number | string, userId?: UserIdParam): Promise<LikeToggleResponse>;
    /**
     * POST: /users/{userId}/dislikes/artists/remove
     * @ru Убрать артиста из непонравившихся.
     * @en Undislike an artist.
     * @param artistId  Artist ID.
     * @param userId  User ID.
     * @returns Promise with result.
     */
    undislikeArtist(artistId: number | string, userId?: UserIdParam): Promise<LikeToggleResponse>;
}
export {};

type TrackMeta = {
  id: string;
  albumId: string;
  timestamp: string;
};

export type DisOrLikedTracksResponse = {
  library: {
    revision: number;
    uid: number;
    tracks: TrackMeta[];
    playlistUuid?: string;
  };
};

export type Like = {
  id: number;
  timestamp: string;
};

export type LikeAlbumResponse = Like[];
export type LikeArtistResponse = Like[];
export type LikePlaylistResponse = Array<{ uid: number; kind: number; timestamp: string }>;
export type LikeClipsResponse = {
  clips: import("./clip.js").Clip[];
  pager: import("./common.js").Pager;
};

export type LikeToggleResponse = { revision: number } | "ok";

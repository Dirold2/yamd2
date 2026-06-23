export type Clip = {
  clipId: number;
  title?: string;
  version?: string;
  playerId?: string;
  uuid?: string;
  thumbnail?: string;
  previewUrl?: string;
  duration?: number;
  trackIds?: number[];
  artists?: import("./artist.js").Artist[];
  disclaimers?: string[];
  explicit?: boolean;
  cover?: { type?: string; prefix?: string; uri?: string };
  contentRestrictions?: { country?: string; restriction?: string };
};

export type ClipsWillLikeResponse = {
  clips: Clip[];
  pager: { page: number; pageSize: number; total: number };
};

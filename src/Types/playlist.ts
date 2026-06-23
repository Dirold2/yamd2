import type { Track } from "./track.js";

type Visibility = "public" | "private" | string;
type Sex = "male" | "female" | string;

export type PlaylistOwner = {
  uid: number;
  login: string;
  name: string;
  verified: boolean;
  sex: Sex;
};

export type PlaylistTrack = {
  id: number;
  timestamp: string;
  recent: boolean;
  track: Track;
};

type PlaylistCoverType = "mosaic" | string;

export type PlaylistCover = {
  error?: string;
  type?: PlaylistCoverType;
  itemsUri?: string[];
  custom?: boolean;
};

export type Playlist = {
  owner: PlaylistOwner;
  playlistUuid: string;
  available: boolean;
  uid: number;
  kind: number;
  title: string;
  revision: number;
  snapshot: number;
  trackCount: number;
  visibility: Visibility;
  collective: boolean;
  created: string;
  modified: string;
  isBanner: boolean;
  isPremiere: boolean;
  durationMs: number;
  cover: PlaylistCover;
  ogImage: string;
  tags: unknown[];
  prerolls: unknown[];
  lastOwnerPlaylists: unknown[];
  tracks?: PlaylistTrack[];
};

export type PlaylistId = number;
export type PlaylistUrl = string;
export type UserId = number;
export type UserName = string;

export interface PlaylistIdentifier {
  id: PlaylistId | string;
  user: UserName | null;
}

export interface UrlExtractorInterface {
  extractTrackId(url: string): number;
  extractAlbumId(url: string): number;
  extractArtistId(url: string): number;
  extractPlaylistId(url: string): PlaylistIdentifier;
}

export type PlaylistRecommendations = {
  playlist: Playlist;
  recommendations: Playlist[];
  batchId?: string;
};

export type PlaylistTrailer = {
  title: string;
  cover: string;
  url: string;
  provider?: string;
  providerVideoId?: string;
};

export type PlaylistSimilarEntities = {
  playlists: Playlist[];
};

export type UserSettings = {
  uid: number;
  settings: Record<string, unknown>;
};

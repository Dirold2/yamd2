import type { GenreId } from "./genre.js";
import type { Pager } from "./common.js";
import type { Track } from "./track.js";
import type { Album } from "./album.js";

type ArtistCoverType = "from-artist-photos" | string;

type ArtistCover = {
  type: ArtistCoverType;
  prefix: string;
  uri: string;
};

type ArtistCounts = {
  tracks: number;
  directAlbums: number;
  alsoAlbums: number;
  alsoTracks: number;
};

type ArtistRatings = {
  week: number;
  month: number;
  day: number;
};

type ArtistLink = {
  title: string;
  href: string;
  type: string;
  socialNetwork: string;
};

export type Artist = {
  id: number;
  name: string;
  various: boolean;
  composer: boolean;
  cover: ArtistCover;
  genres: GenreId[];
  disclaimers: string[];
  ogImage?: string;
  noPicturesFromSearch?: boolean;
  counts?: ArtistCounts;
  available?: boolean;
  ratings?: ArtistRatings;
  links?: ArtistLink[];
  ticketsAvailable?: boolean;
  likesCount: number;
  dbAliases: string[];
  popularTracks?: Track[];
};

export type FilledArtist = {
  artist: Required<Artist>;
  albums: Album[];
  alsoAlbums: Album[];
  similarArtists: Artist[];
};

export type ArtistId = number;
export type ArtistUrl = string;

export type ArtistTracksResponse = {
  pager: Pager;
  tracks: Track[];
};

export type ArtistBriefInfo = {
  artist: Artist;
  albums: Album[];
  alsoAlbums: Album[];
  similarArtists: Artist[];
  links?: ArtistLink[];
  concerts?: string[];
  hasPromotions?: boolean;
};

export type ArtistSimilar = {
  artist: Artist;
  similar: Artist[];
};

export type ArtistLinks = {
  links: ArtistLink[];
};

export type ArtistAbout = {
  text: string;
  url?: string;
};

export type ArtistClips = {
  clips: import("./clip.js").Clip[];
};

export type ArtistDonations = Record<string, unknown>;

export type ArtistInfo = {
  artist: Artist;
  description?: string;
  link?: ArtistLink;
  enlarged?: boolean;
};

export type ArtistSkeleton = Record<string, unknown>;

export type ArtistTrailer = {
  title: string;
  cover: string;
  url: string;
  provider?: string;
  providerVideoId?: string;
};

export type ArtistAlbumsResponse = {
  pager: Pager;
  albums: Album[];
};

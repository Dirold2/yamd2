import type { Artist } from "./artist.js";
import type { Album } from "./album.js";
import type { Track } from "./track.js";

export type SearchType = "artist" | "album" | "track" | "all";

export type SearchOptions = {
  type?: SearchType;
  page?: number;
  nocorrect?: boolean;
  pageSize?: number;
};

export type ConcreteSearchOptions = Omit<SearchOptions, "type">;

export type SearchResponse = {
  type: string;
  page: number;
  perPage: number;
  text: string;
  searchRequestId: string;
  artists?: {
    total: number;
    perPage: number;
    order: number;
    results: Artist[];
  };
  albums?: {
    total: number;
    perPage: number;
    order: number;
    results: Album[];
  };
  tracks?: {
    total: number;
    perPage: number;
    order: number;
    results: Track[];
  };
  best?: {
    type: "track" | "artist" | "album" | "playlist" | "video";
    results: unknown[];
    misspellCorrected: boolean;
    nocorrect: boolean;
  };
};

export type SearchAllResponse = Required<SearchResponse>;
export type SearchArtistsResponse = Required<Omit<SearchResponse, "tracks">>;
export type SearchTracksResponse = Required<Omit<SearchResponse, "albums">>;
export type SearchAlbumsResponse = Required<Omit<SearchResponse, "tracks">>;

export type SearchResponseMap = {
  all: SearchAllResponse;
  artist: SearchArtistsResponse;
  track: SearchTracksResponse;
  album: SearchAlbumsResponse;
};

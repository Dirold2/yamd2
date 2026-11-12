import type { Album } from "./album.js";
import type { Genre } from "./genre.js";
import type { PlaylistOwner, PlaylistCover, PlaylistTrack, Playlist } from "./playlist.js";
export type ChartType = "russia" | "world";
export type ChartTracksResponse = {
    id: string;
    type: string;
    typeForFrom: string;
    title: string;
    chartDescription: string;
    menu: {
        items: Array<{
            title: string;
            url: string;
            selected?: boolean;
        }>;
    };
    chart: {
        owner: PlaylistOwner;
        playlistUuid: string;
        available: boolean;
        uid: number;
        kind: number;
        title: string;
        description: string;
        descriptionFormatted: string;
        revision: number;
        snapshot: number;
        trackCount: number;
        visibility: string;
        collective: boolean;
        created: string;
        modified: string;
        isBanner: boolean;
        isPremiere: boolean;
        durationMs: number;
        cover: PlaylistCover;
        ogImage: string;
        tracks: PlaylistTrack[];
        tags: unknown[];
        likesCount: number;
        similarPlaylists: Playlist[];
        backgroundVideoUrl: string;
        backgroundImageUrl: string;
    };
};
export type NewReleasesResponse = {
    id: string;
    type: string;
    typeForFrom: string;
    title: string;
    newReleases: number[];
};
export type NewPlaylistsResponse = {
    id: string;
    type: string;
    typeForFrom: string;
    title: string;
    newPlaylists: Array<{
        uid: number;
        kind: number;
    }>;
};
export type PodcastsResponse = {
    type: string;
    typeForFrom: string;
    title: string;
    podcasts: Album[];
};
export type GetGenresResponse = Genre[];

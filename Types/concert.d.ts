export type ArtistConcert = {
    id: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: ConcertLocation;
    artist?: import("./artist.js").Artist;
};
export type ConcertLocation = {
    id: number;
    name: string;
    city?: string;
    country?: string;
    geoId?: number;
};
export type ConcertInfo = {
    id: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: ConcertLocation;
    artists?: import("./artist.js").Artist[];
};
export type ConcertSkeleton = Record<string, unknown>;
export type ConcertFeedItem = {
    id: string;
    title: string;
    startDate?: string;
    location?: ConcertLocation;
};
export type ConcertFeed = {
    items: ConcertFeedItem[];
};
export type ConcertLocations = {
    locations: ConcertLocation[];
};
export type ConcertTabItem = {
    id: string;
    title: string;
    selected?: boolean;
};
export type ConcertTabConfig = {
    tabs: ConcertTabItem[];
};
export type ArtistConcerts = {
    concerts: ArtistConcert[];
};

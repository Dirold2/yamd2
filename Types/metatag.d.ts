export type Metatag = {
    id: string;
    name: string;
    title?: string | {
        title: string;
        fullTitle: string;
    };
    description?: string;
    image?: string;
    color?: string;
    liked?: boolean;
    stationId?: string;
    tags?: Metatag[];
    tracks?: import("./track.js").Track[];
    artists?: import("./artist.js").Artist[];
    albums?: import("./album.js").Album[];
    playlists?: import("./playlist.js").Playlist[];
};
export type MetatagTree = {
    title: string;
    navigationId: string;
    leaves: MetatagLeaf[];
};
export type MetatagLeaf = {
    tag: string;
    title: string;
    leaves?: MetatagLeaf[];
};
export type MetatagsResponse = {
    trees: MetatagTree[];
};
export type MetatagAlbumsResponse = {
    pager: {
        page: number;
        pageSize: number;
        total: number;
    };
    albums: import("./album.js").Album[];
};
export type MetatagArtistsResponse = {
    pager: {
        page: number;
        pageSize: number;
        total: number;
    };
    artists: import("./artist.js").Artist[];
};
export type MetatagPlaylistsResponse = {
    pager: {
        page: number;
        pageSize: number;
        total: number;
    };
    playlists: import("./playlist.js").Playlist[];
};

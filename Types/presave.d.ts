export type Presave = {
    albumId: number;
    likeAfterRelease: boolean;
    releaseDate?: string;
    album?: import("./album.js").Album;
};
export type PresavesResponse = {
    presaves: Presave[];
};

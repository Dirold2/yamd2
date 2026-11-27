export type GenreId = "all" | "pop" | "allrock" | "indie" | "metal" | "alternative" | "electronics" | "dance" | "rap" | "rnb" | "jazz" | "blues" | "reggae" | "ska" | "punk" | "folk" | "estrada" | "shanson" | "country" | "soundtrack" | "relax" | "children" | "naturesounds" | "bard" | "forchildren" | "fairytales" | "poemsforchildren" | "podcasts" | "classicalmusic" | "fiction" | "nonfictionliterature" | "booksnotinrussian" | "audiobooks" | "folkgenre" | "other" | string;
type RadioIcon = {
    backgroundColor: string;
    imageUrl: string;
};
export type Genre = {
    id: GenreId;
    weight: number;
    composerTop: boolean;
    title: string;
    fullTitle: string;
    titles: Record<string, {
        title: string;
    }>;
    images: Record<string, string>;
    showInMenu: boolean;
    showInRegions?: number[];
    urlPart?: string;
    color?: string;
    radioIcon?: RadioIcon;
    subGenres?: Genre[];
};
export {};

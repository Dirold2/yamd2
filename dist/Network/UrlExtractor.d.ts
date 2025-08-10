import { UrlExtractorInterface } from "../Types";
export default class UrlExtractor implements UrlExtractorInterface {
    private extract;
    extractTrackId(url: string): number;
    extractAlbumId(url: string): number;
    extractArtistId(url: string): number;
    extractPlaylistId(url: string): {
        id: number | string;
        user: string | null;
    };
}

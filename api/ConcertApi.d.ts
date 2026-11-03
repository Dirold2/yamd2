import type { ArtistConcerts, ConcertInfo, ConcertSkeleton, ConcertFeed, ConcertLocations, ConcertTabConfig } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class ConcertApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /artists/{artistId}/concerts
     * @ru Получить концерты артиста.
     * @en Get concerts for an artist.
     * @param artistId  Artist ID.
     * @returns Promise with concerts.
     */
    getArtistConcerts(artistId: number | string): Promise<ArtistConcerts>;
    /**
     * GET: /concerts/{concertId}/info
     * @ru Получить информацию о концерте.
     * @en Get concert info.
     * @param concertId  Concert ID.
     * @returns Promise with concert info.
     */
    getConcertInfo(concertId: string): Promise<ConcertInfo>;
    /**
     * GET: /concerts/{concertId}/skeletons/{skeletonId}
     * @ru Получить скелет страницы концерта.
     * @en Get concert page skeleton.
     * @param concertId  Concert ID.
     * @param skeletonId  Skeleton ID (default: concert_page).
     * @returns Promise with skeleton.
     */
    getConcertSkeleton(concertId: string, skeletonId?: string): Promise<ConcertSkeleton>;
    /**
     * GET: /concerts/feed
     * @ru Получить ленту концертов.
     * @en Get concerts feed.
     * @param locations  Optional location IDs filter.
     * @returns Promise with concerts feed.
     */
    getConcertsFeed(locations?: (number | string)[]): Promise<ConcertFeed>;
    /**
     * GET: /concerts/locations
     * @ru Получить список локаций концертов.
     * @en Get concert locations list.
     * @returns Promise with locations.
     */
    getConcertsLocations(): Promise<ConcertLocations>;
    /**
     * GET: /concerts/tab-config
     * @ru Получить конфигурацию вкладок концертов.
     * @en Get concerts tab configuration.
     * @returns Promise with config.
     */
    getConcertsTabConfig(): Promise<ConcertTabConfig>;
}

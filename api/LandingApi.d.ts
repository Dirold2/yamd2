import type { ChartType, ChartTracksResponse, NewReleasesResponse, NewPlaylistsResponse, PodcastsResponse, GetGenresResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class LandingApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /landing3/chart/{chartType}
     * @ru Получить чарт.
     * @en Get chart.
     * @param chartType  Chart type.
     * @returns Promise with chart.
     */
    getChart(chartType: ChartType): Promise<ChartTracksResponse>;
    /**
     * GET: /landing3/new-playlists
     * @ru Получить новые плейлисты.
     * @en Get new playlists.
     * @returns Promise with new playlists.
     */
    getNewPlaylists(): Promise<NewPlaylistsResponse>;
    /**
     * GET: /landing3/new-releases
     * @ru Получить новые релизы.
     * @en Get new releases.
     * @returns Promise with new releases.
     */
    getNewReleases(): Promise<NewReleasesResponse>;
    /**
     * GET: /landing3/podcasts
     * @ru Получить подкасты.
     * @en Get podcasts.
     * @returns Promise with podcasts.
     */
    getPodcasts(): Promise<PodcastsResponse>;
    /**
     * GET: /genres
     * @ru Получить список музыкальных жанров.
     * @en Get list of music genres.
     * @returns Promise with genres.
     */
    getGenres(): Promise<GetGenresResponse>;
}

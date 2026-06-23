import type {
  ChartType,
  ChartTracksResponse,
  NewReleasesResponse,
  NewPlaylistsResponse,
  PodcastsResponse,
  GetGenresResponse,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class LandingApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /landing3/chart/{chartType}
   * @ru Получить чарт.
   * @en Get chart.
   * @param chartType  Chart type.
   * @returns Promise with chart.
   */
  getChart(chartType: ChartType): Promise<ChartTracksResponse> {
    return this.ctx.get(this.ctx.createRequest(`/landing3/chart/${chartType}`));
  }

  /**
   * GET: /landing3/new-playlists
   * @ru Получить новые плейлисты.
   * @en Get new playlists.
   * @returns Promise with new playlists.
   */
  getNewPlaylists(): Promise<NewPlaylistsResponse> {
    return this.ctx.get(this.ctx.createRequest("/landing3/new-playlists"));
  }

  /**
   * GET: /landing3/new-releases
   * @ru Получить новые релизы.
   * @en Get new releases.
   * @returns Promise with new releases.
   */
  getNewReleases(): Promise<NewReleasesResponse> {
    return this.ctx.get(this.ctx.createRequest("/landing3/new-releases"));
  }

  /**
   * GET: /landing3/podcasts
   * @ru Получить подкасты.
   * @en Get podcasts.
   * @returns Promise with podcasts.
   */
  getPodcasts(): Promise<PodcastsResponse> {
    return this.ctx.get(this.ctx.createRequest("/landing3/podcasts"));
  }

  /**
   * GET: /genres
   * @ru Получить список музыкальных жанров.
   * @en Get list of music genres.
   * @returns Promise with genres.
   */
  getGenres(): Promise<GetGenresResponse> {
    return this.ctx.get(this.ctx.createRequest("/genres"));
  }
}

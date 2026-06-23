import type {
  Language,
  AllStationsListResponse,
  RecomendedStationsListResponse,
  StationTracksResponse,
  StationInfoResponse,
  RotorSessionCreateBody,
  RotorSessionCreateResponse,
} from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class RadioApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /rotor/stations/list
   * @ru Получить список всех станций.
   * @en Get all stations list.
   * @param language  Language (optional).
   * @returns Promise with all stations.
   */
  getAllStationsList(language?: Language): Promise<AllStationsListResponse> {
    const request = this.ctx.createRequest("/rotor/stations/list");
    if (language) request.setQuery({ language });
    return this.ctx.get(request);
  }

  /**
   * GET: /rotor/stations/dashboard
   * @ru Получить рекомендуемые станции.
   * @en Get recommended stations.
   * @returns Promise with recommended stations.
   */
  getRecomendedStationsList(): Promise<RecomendedStationsListResponse> {
    return this.ctx.get(this.ctx.createRequest("/rotor/stations/dashboard"));
  }

  /**
   * GET: /rotor/station/{stationId}/tracks
   * @ru Получить треки станции.
   * @en Get station tracks.
   * @param stationId  Station ID.
   * @param queue  Optional queue ID for continuation.
   * @returns Promise with station tracks.
   */
  getStationTracks(stationId: string, queue?: string): Promise<StationTracksResponse> {
    const request = this.ctx.createRequest(`/rotor/station/${stationId}/tracks`);
    if (queue) request.addQuery({ queue });
    return this.ctx.get(request);
  }

  /**
   * GET: /rotor/station/{stationId}/info
   * @ru Получить информацию о станции.
   * @en Get station info.
   * @param stationId  Station ID.
   * @returns Promise with station info.
   */
  getStationInfo(stationId: string): Promise<StationInfoResponse> {
    return this.ctx.get(this.ctx.createRequest(`/rotor/station/${stationId}/info`));
  }

  /**
   * POST: /rotor/session/new
   * @ru Создать новую сессию ротора (умное радио).
   * @en Create a new rotor session (smart radio).
   * @param seeds  Array of seed tracks for initialization.
   * @param includeTracksInResponse  Include tracks in response.
   * @returns Promise with created session.
   */
  createRotorSession(
    seeds: string[],
    includeTracksInResponse = true,
  ): Promise<RotorSessionCreateResponse> {
    const body: RotorSessionCreateBody = { seeds, includeTracksInResponse };
    return this.ctx.post(this.ctx.createRequest("/rotor/session/new").setBodyData(body));
  }

  /**
   * POST: /rotor/session/{sessionId}/tracks
   * @ru Получить новые треки для сессии ротора.
   * @en Get new tracks for a rotor session.
   * @param sessionId  Session ID.
   * @param options  Options (queue, batchId).
   * @returns Promise with new tracks.
   */
  postRotorSessionTracks(
    sessionId: string,
    options?: { queue?: string[]; batchId?: string },
  ): Promise<RotorSessionCreateResponse> {
    const body: Record<string, unknown> = {};
    if (options?.queue) body.queue = options.queue;
    if (options?.batchId) body.batchId = options.batchId;

    return this.ctx.post(
      this.ctx.createRequest(`/rotor/session/${sessionId}/tracks`).setBodyData(body as any),
    );
  }
}

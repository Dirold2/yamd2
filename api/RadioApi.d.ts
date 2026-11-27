import type { Language, AllStationsListResponse, RecomendedStationsListResponse, StationTracksResponse, StationInfoResponse, RotorSessionCreateResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class RadioApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /rotor/stations/list
     * @ru Получить список всех станций.
     * @en Get all stations list.
     * @param language  Language (optional).
     * @returns Promise with all stations.
     */
    getAllStationsList(language?: Language): Promise<AllStationsListResponse>;
    /**
     * GET: /rotor/stations/dashboard
     * @ru Получить рекомендуемые станции.
     * @en Get recommended stations.
     * @returns Promise with recommended stations.
     */
    getRecomendedStationsList(): Promise<RecomendedStationsListResponse>;
    /**
     * GET: /rotor/station/{stationId}/tracks
     * @ru Получить треки станции.
     * @en Get station tracks.
     * @param stationId  Station ID.
     * @param queue  Optional queue ID for continuation.
     * @returns Promise with station tracks.
     */
    getStationTracks(stationId: string, queue?: string): Promise<StationTracksResponse>;
    /**
     * GET: /rotor/station/{stationId}/info
     * @ru Получить информацию о станции.
     * @en Get station info.
     * @param stationId  Station ID.
     * @returns Promise with station info.
     */
    getStationInfo(stationId: string): Promise<StationInfoResponse>;
    /**
     * POST: /rotor/session/new
     * @ru Создать новую сессию ротора (умное радио).
     * @en Create a new rotor session (smart radio).
     * @param seeds  Array of seed tracks for initialization.
     * @param includeTracksInResponse  Include tracks in response.
     * @returns Promise with created session.
     */
    createRotorSession(seeds: string[], includeTracksInResponse?: boolean): Promise<RotorSessionCreateResponse>;
    /**
     * POST: /rotor/session/{sessionId}/tracks
     * @ru Получить новые треки для сессии ротора.
     * @en Get new tracks for a rotor session.
     * @param sessionId  Session ID.
     * @param options  Options (queue, batchId).
     * @returns Promise with new tracks.
     */
    postRotorSessionTracks(sessionId: string, options?: {
        queue?: string[];
        batchId?: string;
    }): Promise<RotorSessionCreateResponse>;
}

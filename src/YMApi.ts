import { HyperClient } from "hyperttp";
import type { ApiConfig } from "./Types/index.js";
import fallbackConfig from "./PreparedRequest/config.js";
import { ApiContext } from "./api/ApiContext.js";

import { AuthApi } from "./api/AuthApi.js";
import { AccountApi } from "./api/AccountApi.js";
import { LandingApi } from "./api/LandingApi.js";
import { SearchApi } from "./api/SearchApi.js";
import { TrackApi } from "./api/TrackApi.js";
import { AlbumApi } from "./api/AlbumApi.js";
import { ArtistApi } from "./api/ArtistApi.js";
import { PlaylistApi } from "./api/PlaylistApi.js";
import { UserApi } from "./api/UserApi.js";
import { RadioApi } from "./api/RadioApi.js";
import { QueueApi } from "./api/QueueApi.js";
import { LabelApi } from "./api/LabelApi.js";
import { CreditApi } from "./api/CreditApi.js";
import { DisclaimerApi } from "./api/DisclaimerApi.js";
import { MetatagApi } from "./api/MetatagApi.js";
import { ClipApi } from "./api/ClipApi.js";
import { PinApi } from "./api/PinApi.js";
import { PresaveApi } from "./api/PresaveApi.js";
import { MusicHistoryApi } from "./api/MusicHistoryApi.js";
import { DeviceAuthApi } from "./api/DeviceAuthApi.js";
import { ConcertApi } from "./api/ConcertApi.js";

export {
  YMApiError,
  AuthError,
  TrackNotFoundError,
  DownloadInfoError,
  InvalidUrlError,
} from "./Types/index.js";

export default class YMApi {
  auth: AuthApi;
  account: AccountApi;
  landing: LandingApi;
  search: SearchApi;
  tracks: TrackApi;
  albums: AlbumApi;
  artists: ArtistApi;
  playlists: PlaylistApi;
  user: UserApi;
  radio: RadioApi;
  queues: QueueApi;
  labels: LabelApi;
  credits: CreditApi;
  disclaimers: DisclaimerApi;
  metatags: MetatagApi;
  clips: ClipApi;
  pins: PinApi;
  presaves: PresaveApi;
  musicHistory: MusicHistoryApi;
  deviceAuth: DeviceAuthApi;
  concerts: ConcertApi;

  init: AuthApi["init"];

  constructor(httpClient?: HyperClient, config: ApiConfig = fallbackConfig) {
    const ctx = new ApiContext(httpClient, config);

    this.auth = new AuthApi(ctx);
    this.account = new AccountApi(ctx);
    this.landing = new LandingApi(ctx);
    this.search = new SearchApi(ctx);
    this.tracks = new TrackApi(ctx);
    this.albums = new AlbumApi(ctx);
    this.artists = new ArtistApi(ctx);
    this.playlists = new PlaylistApi(ctx);
    this.user = new UserApi(ctx);
    this.radio = new RadioApi(ctx);
    this.queues = new QueueApi(ctx);
    this.labels = new LabelApi(ctx);
    this.credits = new CreditApi(ctx);
    this.disclaimers = new DisclaimerApi(ctx);
    this.metatags = new MetatagApi(ctx);
    this.clips = new ClipApi(ctx);
    this.pins = new PinApi(ctx);
    this.presaves = new PresaveApi(ctx);
    this.musicHistory = new MusicHistoryApi(ctx);
    this.deviceAuth = new DeviceAuthApi(httpClient);
    this.concerts = new ConcertApi(ctx);

    this.init = this.auth.init.bind(this.auth);
  }
}

import type { Artist } from "./artist.js";
import type { Track } from "./track.js";

type StationTrack = {
  type: string;
  track: Track;
  liked: boolean;
  trackParameters: {
    bpm: number;
    hue: number;
    energy: number;
  };
};

export type StationTracksResponse = {
  id: { type: string; tag: string };
  sequence: StationTrack[];
  batchId: string;
  pumpkin: boolean;
  radioSessionId: string;
};

type StationId = { type: string; tag: string };

type StationSettings = {
  language: string;
  mood?: number;
  energy?: number;
  moodEnergy?: string;
  diversity: string;
};

type StationAdParams = {
  partnerId: string;
  categoryId: string;
  pageRef: string;
  targetRef: string;
  otherParams: string;
  adVolume: number;
};

type StationRestrictionsValue = {
  value: number;
  name: string;
  imageUrl?: string;
  unspecified?: boolean;
  serializedSeed?: string;
};

type StationRestrictionsOption<T extends StationRestrictionsValue = StationRestrictionsValue> = {
  type: string;
  name: string;
  possibleValues?: T[];
  min?: T;
  max?: T;
};

type StationRestrictions = {
  diversity: Required<Omit<StationRestrictionsOption, "max">>;
  language: Required<Omit<StationRestrictionsOption, "max">>;
  mood?: Required<StationRestrictionsOption>;
  energy?: Required<StationRestrictionsOption>;
  moodEnergy?: Required<Omit<StationRestrictionsOption, "max">>;
};

type StationData = {
  artists: Artist[];
  title?: string;
  description?: string;
  imageUri?: string;
};

type StationInfo = {
  station: {
    id: StationId;
    parentId?: StationId;
    name: string;
    icon: { backgroundColor: string; imageUrl: string };
    mtsIcon: { backgroundColor: string; imageUrl: string };
    fullImageUrl: string;
    mtsFullImageUrl?: string;
    idForFrom: string;
    restrictions: Required<Omit<StationRestrictions, "moodEnergy">>;
    restrictions2: Required<Omit<StationRestrictions, "energy">>;
    listeners?: number;
    visibility?: string;
    login?: string;
    displayName?: string;
    fullName?: string;
  };
  data?: StationData;
  settings: Required<Omit<StationSettings, "moodEnergy">>;
  settings2: Required<Omit<StationSettings, "energy">>;
  adParams: StationAdParams;
  rupTitle: string;
  rupDescription: string;
};

export type StationInfoResponse = StationInfo[];

export type AllStationsListResponse = StationInfo[];

export type RecomendedStationsListResponse = {
  dashboardId: string;
  stations: StationInfo[];
  pumpkin: boolean;
};

export type RotorSessionCreateBody = {
  seeds: string[];
  includeTracksInResponse?: boolean;
};

type RotorSeed = {
  value: string;
  tag: string;
  type: string;
};

export type RotorSessionCreateResponse = {
  radioSessionId: string;
  sequence: StationTrack[];
  batchId: string;
  pumpkin: boolean;
  descriptionSeed?: RotorSeed;
  acceptedSeeds?: RotorSeed[];
  terminated?: boolean;
};

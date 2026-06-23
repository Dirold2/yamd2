import { DownloadTrackCodec } from "../Types/index.js";
import type { CodecConfig as CodecConfigType } from "../Types/index.js";

export type { CodecConfigType };

export const CODEC_CONFIG: Record<DownloadTrackCodec, CodecConfigType> = {
  [DownloadTrackCodec.MP3]: {
    codecs: "mp3",
    transport: "raw",
    encrypted: false,
  },
  [DownloadTrackCodec.AAC]: {
    codecs: "aac",
    transport: "encraw",
    encrypted: true,
  },
  [DownloadTrackCodec.AACMP4]: {
    codecs: "aac-mp4",
    transport: "encraw",
    encrypted: true,
  },
  [DownloadTrackCodec.HEACC]: {
    codecs: "he-aac",
    transport: "encraw",
    encrypted: true,
  },
  [DownloadTrackCodec.HEACCMP4]: {
    codecs: "he-aac-mp4",
    transport: "encraw",
    encrypted: true,
  },
  [DownloadTrackCodec.FLAC]: {
    codecs: "flac",
    transport: "encraw",
    encrypted: true,
  },
  [DownloadTrackCodec.FLACMP4]: {
    codecs: "flac-mp4",
    transport: "encraw",
    encrypted: true,
  },
} as const;

export const CODEC_PRIORITY = [
  DownloadTrackCodec.FLACMP4,
  DownloadTrackCodec.FLAC,
  DownloadTrackCodec.AACMP4,
  DownloadTrackCodec.AAC,
  DownloadTrackCodec.HEACCMP4,
  DownloadTrackCodec.HEACC,
  DownloadTrackCodec.MP3,
] as const;

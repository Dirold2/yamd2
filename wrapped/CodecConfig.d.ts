import { DownloadTrackCodec } from "../Types/index.js";
import type { CodecConfig as CodecConfigType } from "../Types/index.js";
export type { CodecConfigType };
export declare const CODEC_CONFIG: Record<DownloadTrackCodec, CodecConfigType>;
export declare const CODEC_PRIORITY: readonly [DownloadTrackCodec.FLACMP4, DownloadTrackCodec.FLAC, DownloadTrackCodec.AACMP4, DownloadTrackCodec.AAC, DownloadTrackCodec.HEACCMP4, DownloadTrackCodec.HEACC, DownloadTrackCodec.MP3];

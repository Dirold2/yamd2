import type { TrackId, TrackUrl } from "./track.js";
import { DownloadTrackCodec } from "./track.js";
export declare class YMApiError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class AuthError extends YMApiError {
    constructor(message?: string);
}
export declare class TrackNotFoundError extends YMApiError {
    readonly trackId: TrackId;
    constructor(trackId: TrackId);
}
export declare class DownloadInfoError extends YMApiError {
    constructor(message: string);
}
export declare class InvalidUrlError extends YMApiError {
    readonly url: string;
    constructor(url: string);
}
export declare class ExtractionError extends YMApiError {
    readonly entity: string;
    readonly input: string;
    constructor(entity: string, input: string);
}
export declare class DownloadError extends YMApiError {
    readonly trackId: TrackId | TrackUrl;
    readonly codec: DownloadTrackCodec;
    constructor(trackId: TrackId | TrackUrl, codec: DownloadTrackCodec);
}

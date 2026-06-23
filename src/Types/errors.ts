import type { TrackId, TrackUrl } from "./track.js";
import { DownloadTrackCodec } from "./track.js";

export class YMApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "YMApiError";
  }
}

export class AuthError extends YMApiError {
  constructor(message = "Authentication required") {
    super(message, "AUTH_REQUIRED");
    this.name = "AuthError";
  }
}

export class TrackNotFoundError extends YMApiError {
  constructor(public readonly trackId: TrackId) {
    super(`Track not found: ${trackId}`, "TRACK_NOT_FOUND");
    this.name = "TrackNotFoundError";
  }
}

export class DownloadInfoError extends YMApiError {
  constructor(message: string) {
    super(message, "DOWNLOAD_INFO_ERROR");
    this.name = "DownloadInfoError";
  }
}

export class InvalidUrlError extends YMApiError {
  constructor(public readonly url: string) {
    super(`Invalid Yandex Music URL: ${url}`, "INVALID_URL");
    this.name = "InvalidUrlError";
  }
}

export class ExtractionError extends YMApiError {
  constructor(
    public readonly entity: string,
    public readonly input: string,
  ) {
    super(`Failed to extract ${entity} from: ${input}`, "EXTRACTION_FAILED");
    this.name = "ExtractionError";
  }
}

export class DownloadError extends YMApiError {
  constructor(
    public readonly trackId: TrackId | TrackUrl,
    public readonly codec: DownloadTrackCodec,
  ) {
    super(`URL not found for track ${trackId} with codec ${codec}`, "DOWNLOAD_URL_NOT_FOUND");
    this.name = "DownloadError";
  }
}

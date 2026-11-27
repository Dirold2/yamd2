import type { Artist } from "./artist.js";
import type { Album } from "./album.js";
import type { Language } from "./common.js";
export type TrackId = number;
export type TrackUrl = string;
type TrackMajor = {
    id: number;
    name: string;
};
type TrackContentWarning = "explicit" | string;
type TrackR128 = {
    i: number;
    tp: number;
};
type TrackFade = {
    inStart: number;
    inStop: number;
    outStart: number;
    outStop: number;
};
type TrackLyricsInfo = {
    hasAvailableSyncLyrics: boolean;
    hasAvailableTextLyrics: boolean;
};
export type Track = {
    id: number;
    realId: string;
    title: string;
    contentWarning?: TrackContentWarning;
    version: string;
    major?: TrackMajor;
    available: boolean;
    availableForPremiumUsers: boolean;
    availableFullWithoutPermission?: boolean;
    disclaimers: string[];
    availableForOptions: string[];
    durationMs: number;
    storageDir?: string;
    fileSize?: number;
    r128: TrackR128;
    fade: TrackFade;
    previewDurationMs?: number;
    artists: Artist[];
    albums: Album[];
    lyricsAvailable: boolean;
    coverUri: string;
    ogImage: string;
    rememberPosition: boolean;
    type: string;
    trackSharingFlag?: string;
    lyricsInfo: TrackLyricsInfo;
    trackSource: string;
};
export type GetTrackResponse = Track[];
type Lyrics = {
    id: number;
    lyrics: string;
    fullLyrics: string;
    hasRights: boolean;
    showTranslation: boolean;
    textLanguage: Language;
};
type VideoProvider = "youtube" | string;
type Video = {
    title: string;
    cover: string;
    url: string;
    provider: VideoProvider;
    providerVideoId: string;
    embed: string;
};
export type TrackLyrics = {
    id: number;
    lyrics: string;
    fullLyrics: string;
    hasRights: boolean;
    showTranslation: boolean;
    textLanguage: Language;
};
export type TrackTrailer = {
    title: string;
    cover: string;
    url: string;
    provider?: string;
    providerVideoId?: string;
};
export type TrackFullInfo = {
    track: Track;
    similarTracks?: Track[];
    trackLyrics?: TrackLyrics;
    albums?: import("./album.js").Album[];
};
export type GetTrackSupplementResponse = {
    id: number;
    lyrics: Lyrics;
    videos: Video[];
};
export type SimilarTracksResponse = {
    track: Track;
    similarTracks: Track[];
};
type AudioCodec = "flac" | "aac" | "he-aac" | "flac-mp4" | "aac-mp4" | "he-aac-mp4" | "mp3" | string;
export declare enum DownloadTrackQuality {
    Lossless = "lossless",
    High = "high",
    Low = "low"
}
export declare enum DownloadTrackCodec {
    FLAC = "flac",
    FLACMP4 = "flac-mp4",
    AAC = "aac",
    AACMP4 = "aac-mp4",
    HEACC = "he-aac",
    HEACCMP4 = "he-aac-mp4",
    MP3 = "mp3"
}
export type DownloadInfo = {
    quality: DownloadTrackQuality;
    codec: AudioCodec;
    gain: boolean;
    preview: boolean;
    downloadInfoUrl: string;
    direct: boolean;
    bitrateInKbps: number;
    encrypted: boolean;
};
export interface DecryptedDownloadInfo extends DownloadInfo {
    decryptedUrl?: string;
    decryptedBuffer?: ArrayBuffer;
}
export type GetTrackDownloadInfoResponse = DownloadInfo[];
export type FileInfoResponse = {
    file: {
        downloadUrl: string;
        size?: number;
        type?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
};
export type FileInfoResponseNew = {
    downloadInfo: {
        trackId: string;
        quality: string;
        codec: string;
        bitrate: number;
        transport: string;
        size: number;
        gain: boolean;
        url: string;
        urls: string[];
        realId: string;
        [key: string]: unknown;
    };
};
export type Codecs = "flac,aac,he-aac,mp3,flac-mp4,aac-mp4,he-aac-mp4" | "flac,aac,he-aac,mp3" | "flac-mp4,flac" | "flac,aac,he-aac" | "flac,aac" | "flac" | "flac-mp4" | "aac" | "he-aac" | "mp3" | "aac-mp4" | "he-aac-mp4";
export type Transport = "raw" | "encraw";
export interface CodecConfig {
    readonly codecs: Codecs;
    readonly transport: Transport;
    readonly encrypted: boolean;
}
export interface DownloadOptions {
    codec?: DownloadTrackCodec;
    quality?: DownloadTrackQuality;
    forceRaw?: boolean;
}
export {};

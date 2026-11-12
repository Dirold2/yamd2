import type { Track } from "./track.js";
import type { Album } from "./album.js";
import type { Artist } from "./artist.js";
import type { GenreId } from "./genre.js";
import type { Playlist } from "./playlist.js";
type PlusStatus = {
    hasPlus: boolean;
    isTutorialCompleted: boolean;
};
type Subscription = {
    expires: string;
    vendor: string;
    vendorHelpUrl: string;
    productId: string;
    orderId: number;
    finished: boolean;
};
type SubscriptionStatus = {
    autoRenewable: Subscription[];
    nonAutoRenewableRemainder: Record<string, unknown>;
    canStartTrial: boolean;
    mcdonalds: boolean;
};
type Permissions = {
    until: string;
    values: string[];
    default: string[];
};
type PassportPhone = {
    phone: string;
};
type Account = {
    now: string;
    uid: number;
    login: string;
    region: number;
    fullName: string;
    secondName: string;
    firstName: string;
    displayName: string;
    birthday: string;
    serviceAvailable: boolean;
    hostedUser: boolean;
    "passport-phones": PassportPhone[];
    registeredAt: string;
};
export type GetAccountStatusResponse = {
    account: Account;
    permissions: Permissions;
    subscription: SubscriptionStatus;
    subeditor: boolean;
    subeditorLevel: number;
    plus: PlusStatus;
    defaultEmail: string;
};
type GeneratedPlaylistType = "rewind20" | "playlistOfTheDay" | "missedLikes" | "origin" | "family" | "recentTracks" | "neverHeard" | "podcasts" | "kinopoisk" | string;
type GeneratedPlaylist = {
    type: GeneratedPlaylistType;
    ready: boolean;
    notify: boolean;
    data: Playlist;
};
type FeedDayEventTitle = {
    type: string;
    text: string;
};
type FeedDayEventAugmentedArtist = {
    artist: Artist;
    subscribed: true;
};
type FeedDayEventArtist = {
    augmentedArtist: FeedDayEventAugmentedArtist;
    playsDurationMillis: number;
};
type FeedDayEvent = {
    id: string;
    type: string;
    typeForFrom: string;
    title: FeedDayEventTitle[];
    artists?: FeedDayEventArtist[];
    likedTrack?: Track;
    tracks?: Track[];
    radioIsAvailable?: boolean;
    genre?: GenreId;
    albums?: Album[];
    similarToGenre?: GenreId;
    similarGenre?: GenreId;
    similarToArtist?: Artist;
    similarArtists?: Artist[];
    artist?: Artist;
    socialTracks?: Track[];
};
type FeedDayTrackToPlayWithAds = {
    type: string;
    track: Track;
};
type FeedDay = {
    day: string;
    events: FeedDayEvent[];
    tracksToPlay: Track[];
    tracksToPlayWithAds: FeedDayTrackToPlayWithAds[];
};
export type GetFeedResponse = {
    nextRevision: string;
    canGetMoreEvents: boolean;
    pumpkin: boolean;
    isWizardPassed: boolean;
    generatedPlaylists: GeneratedPlaylist[];
    headlines: unknown[];
    today: string;
    days: FeedDay[];
};
export {};

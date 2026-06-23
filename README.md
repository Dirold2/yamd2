# Yandex.Music API (Unofficial) for Node

This is a Node.js wrapper for the [Yandex.Music](http://music.yandex.ru/) API that is used in mobile apps (iOS/Android).

## Localization

[**English**](./README.md), [Русский](./lang/ru/README.md)

## Installation

### NPM

```sh
npm install yamd2
```

### Yarn

```sh
yarn add yamd2
```

### PNPM

```sh
pnpm add yamd2
```

### Bun

```sh
bun add yamd2
```

### From GitHub

```sh
npm install github:Dirold2/yamd2#__dist__
```

## Usage

```js
import { YMApi, WrappedYMApi, Types } from "yamd2";

// Basic API usage — methods are organized by domain
const api = new YMApi();
await api.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });

const searchResult = await api.search.query("gorillaz", { type: "artist" });
const artist = searchResult.artists?.results?.[0];
const tracks = await api.artists.getArtistTracks(artist.id);
console.log(tracks);

// Enhanced API with additional features
const wrappedApi = new WrappedYMApi();
await wrappedApi.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });

// Get track download info with codec support
const downloadInfo = await wrappedApi.getDownloadInfo("123456", {
  codec: "flac",
  quality: "lossless"
});

// Get best available download URL
const bestUrl = await wrappedApi.getBestDownloadUrl("123456");

// Support for URLs and IDs
const track = await wrappedApi.getTrack("https://music.yandex.ru/track/123456");
```

Get token from [here](https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d) and uid from [here](https://mail.yandex.ru/).

## Available methods

Methods are organized into domain fields on the `YMApi` instance:

### api.auth

- `init(config)` — Authenticate and initialize the API

### api.account

- `getAccountStatus()` — Get current user account status
- `getFeed()` — Get user feed (generated playlists, days)

### api.landing

- `getChart(chartType?)` — Get chart
- `getNewReleases()` — Get new album releases
- `getNewPlaylists()` — Get new playlists
- `getPodcasts()` — Get podcasts
- `getGenres()` — Get list of music genres

### api.search

- `query(q, options?)` — Search across all or specific type
- `artists(q, options?)` — Search artists only
- `tracks(q, options?)` — Search tracks only
- `albums(q, options?)` — Search albums only
- `all(q, options?)` — Search all types

### api.tracks

- `getTrack(trackId)` — Get track(s) by ID
- `getSingleTrack(trackId)` — Get single track
- `getTracks(trackIds)` — Get multiple tracks
- `getTrackSupplement(trackId)` — Get track supplement
- `getTrackLyrics(trackId, format?)` — Get track lyrics
- `getTrackTrailer(trackId)` — Get track trailer
- `getTrackFullInfo(trackId)` — Get full track info (including similar, supplement, etc.)
- `getTrackDownloadInfo(trackId, quality?, canUseStreaming?)` — Get download info
- `getTrackDownloadInfoNew(trackId, quality?, codecs?, transport?)` — New API endpoint
- `getTrackDirectLink(downloadUrl, short?)` — Resolve direct download link
- `getTrackDirectLinkNew(trackUrl)` — Resolve new format direct link
- `getTrackShareLink(track)` — Generate share URL
- `getSimilarTracks(trackId)` — Get similar tracks

### api.albums

- `getAlbum(albumId, withTracks?)` — Get album
- `getAlbums(albumIds)` — Get multiple albums
- `getAlbumWithTracks(albumId)` — Get album with volumes/tracks
- `getAlbumSimilarEntities(albumId)` — Get similar entities for album
- `getAlbumTrailer(albumId)` — Get album trailer

### api.artists

- `getArtist(artistId)` — Get artist info
- `getArtists(artistIds)` — Get multiple artists
- `getArtistTracks(artistId, options?)` — Get artist tracks
- `getArtistBriefInfo(artistId)` — Get artist brief info
- `getArtistDirectAlbums(artistId, options?)` — Get direct albums
- `getArtistSimilar(artistId)` — Get similar artists
- `getArtistLinks(artistId)` — Get artist links
- `getArtistAlsoAlbums(artistId, options?)` — Get also albums
- `getArtistDiscographyAlbums(artistId, options?)` — Get discography albums
- `getArtistSafeDirectAlbums(artistId, options?)` — Get safe direct albums
- `getArtistTrackIds(artistId, options?)` — Get artist track IDs
- `getArtistAbout(artistId)` — Get artist about info
- `getArtistClips(artistId)` — Get artist clips
- `getArtistDonation(artistId)` — Get artist donation info
- `getArtistInfo(artistId)` — Get extended artist info
- `getArtistSkeleton(artistId, skeletonId?)` — Get artist skeleton
- `getArtistTrailer(artistId)` — Get artist trailer

### api.playlists

- `getPlaylist(playlistId, user?)` — Get playlist
- `getPlaylistNew(playlistId)` — Get playlist by string ID
- `getPlaylists(playlistIds, user?, options?)` — Get multiple playlists
- `getUserPlaylists(userId)` — Get user playlists
- `getPlaylistRecommendations(kind, userId?)` — Get playlist recommendations
- `getPlaylistKinds(userId?)` — Get user playlist kinds
- `getPlaylistTrailer(kind, userId?)` — Get playlist trailer
- `getPlaylistSimilarEntities(playlistUuid)` — Get similar entities
- `createPlaylist(name, options?)` — Create playlist
- `removePlaylist(playlistId)` — Remove playlist
- `renamePlaylist(playlistId, name)` — Rename playlist
- `addTracksToPlaylist(playlistId, tracks, revision, options?)` — Add tracks
- `removeTracksFromPlaylist(playlistId, tracks, revision, options?)` — Remove tracks
- `setPlaylistVisibility(playlistId, visibility, userId?)` — Set playlist visibility
- `setPlaylistDescription(playlistId, description, userId?)` — Set playlist description
- `collectiveJoin(userId, token)` — Join collective playlist
- `getUserSettings(userId?)` — Get user settings

### api.radio

- `getAllStationsList(language?)` — Get all stations
- `getRecomendedStationsList()` — Get recommended stations
- `getStationTracks(stationId, queue?)` — Get station tracks
- `getStationInfo(stationId)` — Get station info
- `createRotorSession(seeds, includeTracksInResponse?)` — Create rotor session
- `postRotorSessionTracks(sessionId, options)` — Get rotor session tracks

### api.user

- `getLikedTracks(userId?)` — Get liked tracks
- `likeTracks(trackIds, userId?)` — Like tracks
- `unlikeTracks(trackIds, userId?)` — Unlike tracks
- `getLikedAlbums(userId?)` — Get liked albums
- `likeAlbums(albumIds, userId?)` — Like albums
- `unlikeAlbums(albumIds, userId?)` — Unlike albums
- `getLikedArtists(userId?)` — Get liked artists
- `likeArtists(artistIds, userId?)` — Like artists
- `unlikeArtists(artistIds, userId?)` — Unlike artists
- `getLikedPlaylists(userId?)` — Get liked playlists
- `likePlaylists(playlistIds, userId?)` — Like playlists
- `unlikePlaylists(playlistIds, userId?)` — Unlike playlists
- `getLikedClips(userId?, page?, pageSize?)` — Get liked clips
- `likeClip(clipId, userId?)` — Like a clip
- `unlikeClip(clipId, userId?)` — Unlike a clip
- `getDislikedTracks(userId?)` — Get disliked tracks
- `dislikeTracks(trackIds, userId?)` — Dislike tracks
- `undislikeTracks(trackIds, userId?)` — Undislike tracks
- `getDislikedArtists(userId?)` — Get disliked artists
- `dislikeArtist(artistId, userId?)` — Dislike artist
- `undislikeArtist(artistId, userId?)` — Undislike artist

### api.queues

- `getQueues()` — Get all queues
- `getQueue(queueId)` — Get specific queue

### api.labels

- `getLabel(labelId)` — Get label info
- `getLabelAlbums(labelId, options?)` — Get label albums
- `getLabelArtists(labelId, options?)` — Get label artists

### api.credits

- `getTrackCredits(trackId)` — Get track credits
- `getClipCredits(clipId)` — Get clip credits

### api.disclaimers

- `getTrackDisclaimer(trackId)` — Get track disclaimer
- `getAlbumDisclaimer(albumId)` — Get album disclaimer
- `getArtistDisclaimer(artistId)` — Get artist disclaimer
- `getClipDisclaimer(clipId)` — Get clip disclaimer

### api.metatags

- `getMetatags()` — Get all metatags
- `getMetatag(metatagId, options?)` — Get metatag with entities
- `getMetatagAlbums(metatagId, options?)` — Get metatag albums
- `getMetatagArtists(metatagId, options?)` — Get metatag artists
- `getMetatagPlaylists(metatagId, options?)` — Get metatag playlists

### api.clips

- `getClips(clipIds)` — Get clips by IDs
- `getClipsWillLike(page?, pageSize?)` — Get clips the user will like

### api.pins

- `getPins()` — Get all pins
- `pinAlbum(albumId)` — Pin album
- `unpinAlbum(albumId)` — Unpin album
- `pinArtist(artistId)` — Pin artist
- `unpinArtist(artistId)` — Unpin artist
- `pinPlaylist(uid, kind)` — Pin playlist
- `unpinPlaylist(uid, kind)` — Unpin playlist
- `pinWave(seeds)` — Pin wave
- `unpinWave(seeds)` — Unpin wave

### api.presaves

- `getPresaves(options?)` — Get presaved albums
- `addPresave(albumId, options?)` — Presave an album
- `removePresave(albumId, options?)` — Remove presave

### api.musicHistory

- `getMusicHistory(fullModelsCount?)` — Get music history
- `getMusicHistoryItems(items)` — Get music history items by types

### api.deviceAuth

- `requestDeviceCode(options?)` — Request device code from OAuth
- `pollDeviceToken(deviceCode, options?)` — Poll for OAuth token
- `deviceAuth(onCode, options?)` — Full device auth flow (polling loop)

### api.concerts

- `getArtistConcerts(artistId)` — Get concerts for artist
- `getConcertInfo(concertId)` — Get concert info
- `getConcertSkeleton(concertId, skeletonId?)` — Get concert skeleton
- `getConcertsFeed(locations?)` — Get concerts feed
- `getConcertsLocations()` — Get concert locations
- `getConcertsTabConfig()` — Get concerts tab config

### Wrapped API (WrappedYMApi)

Enhanced API with additional features and convenience methods:

#### Tracks

- getDownloadInfo - Get download information with codec support
- getDownloadUrl - Get direct download URL
- getBestDownloadUrl - Get best available URL by codec priority
- getDownloadUrlForFFmpeg - Get FFmpeg-compatible URL (RAW MP3)
- getMp3DownloadInfo - Get MP3 download info
- getMp3DownloadUrl - Get MP3 download URL
- getAacDownloadInfo - Get AAC download info
- getAacDownloadUrl - Get AAC download URL
- getFlacDownloadInfo - Get FLAC download info
- getFlacDownloadUrl - Get FLAC download URL
- getFlacMP4DownloadInfo - Get FLAC-MP4 download info
- getFlacMP4DownloadUrl - Get FLAC-MP4 download URL
- getTrack - Get track by ID or URL
- isEncryptedUrl - Check if URL is encrypted

#### Playlist

- getPlaylist - Get playlist by ID or URL

#### Album

- getAlbum - Get album by ID or URL
- getAlbumWithTracks - Get album with tracks by ID or URL

#### Artist

- getArtist - Get artist by ID or URL

#### Etc

- getShortenedLink - Get shortened link

## Features

### Codec Support

The WrappedYMApi supports multiple audio codecs with automatic quality selection:

- **FLAC** - Lossless, high quality
- **FLAC-MP4** - Lossless in MP4 container
- **AAC** - Standard compression
- **AAC-MP4** - AAC in MP4 container
- **HE-AAC** - High efficiency
- **HE-AAC-MP4** - HE-AAC in MP4 container
- **MP3** - Wide compatibility

### URL Support

All methods accept both entity IDs and URLs:

```js
// By ID
const track = await wrappedApi.getTrack(123456);

// By URL
const track = await wrappedApi.getTrack("https://music.yandex.ru/track/123456");
```

### Error Handling

Comprehensive error handling with specific error types:

```js
import { YMApiError, ExtractionError, DownloadError } from "yamd2";

try {
  const result = await wrappedApi.getDownloadUrl("invalid-url");
} catch (error) {
  if (error instanceof ExtractionError) {
    console.log(`Failed to extract ID from URL: ${error.input}`);
  } else if (error instanceof DownloadError) {
    console.log(
      `URL not found for track ${error.trackId} with codec ${error.codec}`
    );
  }
}
```

### Download Quality Priority

When using `getBestDownloadUrl()`, codecs are checked in priority order:

1. FLAC-MP4
2. FLAC
3. AAC-MP4
4. AAC
5. HE-AAC-MP4
6. HE-AAC
7. MP3

## Examples

See the [examples directory](./example/) for detailed usage examples:

- [Track download](./example/get-tracks-download-new.ts)
- [Wrapped API usage](./example/track-wrapped.ts)
- [Playlist management](./example/playlist.ts)
- [Search functionality](./example/search.ts)

## Acknowledgements

- [itsmepetrov/yandex-music-api](https://github.com/itsmepetrov/yandex-music-api)
- [MarshalX/yandex-music-api](https://github.com/MarshalX/yandex-music-api)
- [kontsevoye/ym-api](https://github.com/kontsevoye/ym-api)
- [kotisoff/ym-api-meowed](https://github.com/kotisoff/ym-api-meowed)

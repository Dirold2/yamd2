# Yandex.Music API (Unofficial) for Node

This is a Node.js wrapper for the [Yandex.Music](http://music.yandex.ru/) API that is used in mobile apps (iOS/Android).

## Localization

[__English__](./README.md), [Русский](./lang/ru/README.md)

## Installation

### NPM

```sh
npm install ym-api-meowed
```

### Yarn

```sh
yarn add ym-api-meowed
```

### PNPM

```sh
pnpm add ym-api-meowed
```

### Bun

```sh
bun add ym-api-meowed
```

### From GitHub

```sh
npm install github:Dirold2/yamd2#__dist__
```

## Usage

```js
import { YMApi, WrappedYMApi } from "yamd2";

// Basic API usage
const api = new YMApi();
await api.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });
const result = await api.searchArtists("gorillaz");
console.log({ result });

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

This library provides following methods:

### Plain API (YMApi)

#### Users

- getAccountStatus
- getFeed

#### Music

- getChart
- getNewReleases
- getPodcasts
- getGenres
- search
- searchArtists
- searchTracks
- searchAlbums
- searchAll

#### Playlist

- getNewPlaylists
- getPlaylist
- getPlaylists
- getUserPlaylists
- createPlaylist
- removePlaylist
- renamePlaylist
- addTracksToPlaylist
- removeTracksFromPlaylist

#### Tracks

- getTrack
- getArtistTracks
- getSingleTrack
- getTrackSupplement
- getTrackDownloadInfo
- getTrackDownloadInfoNew
- getTrackDirectLink
- getTrackDirectLinkNew
- getTrackShareLink
- getSimilarTracks
- getDislikedTracks
- getLikedTracks

#### Album

- getAlbums
- getAlbum
- getAlbumWithTracks

#### Artist

- getArtist
- getArtists

#### Station

- getAllStationsList
- getRecomendedStationsList
- getStationTracks
- getStationInfo

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
    console.log(`URL not found for track ${error.trackId} with codec ${error.codec}`);
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
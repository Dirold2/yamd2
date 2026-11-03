# Changelog

## [1.6.0] — 2026-11-03

### Fixed

- Example imports now use explicit ESM paths so the full examples typecheck passes.
- Credit and pin response types now match the API object wrappers (`credits` and `pins`); credit entries use `title` and `value`.
- Playlist track removal now calculates the default end position relative to the starting offset.
- Track streaming cancels HTTP error bodies and releases the reader lock even when cancellation fails.
- Wrapped playlist lookup now accepts bare UUIDs, including `ar.`-prefixed IDs.
- Device authorization checks its deadline before and after polling and limits polling delays to the remaining time.
- Encrypted track downloads now reject missing or invalid AES keys before fetching the audio file, allowing codec fallback without wasting bandwidth.
- Encrypted track downloads now reject unsuccessful HTTP responses before reading or decrypting the body.

### Added

- `WrappedYMApi.streamTrack(track, options?, signal?)` streams raw or AES-CTR-decrypted audio without buffering the complete file; early termination cancels the audio response.
- Offline regression tests for playlist removal, streaming cleanup, playlist identifiers, device authorization deadlines, and download errors.

## [1.5.3] — 2026-10-14

### Changed

- Updated `hyperttp` to `^0.5.6`, `@hyperttp/types` to `^0.4.2`, and `chalk` to `^6.0.1`.
- Removed direct Bun and Undici transport dependencies.
- Updated development dependencies: `@types/node` to `^26.6.5`, `oxfmt` to `^0.73.0`, `oxlint` to `^1.88.0`, and `tsx` to `^4.23.15`.

## [1.5.2] — 2026-08-27

### Changed

- Updated `hyperttp` to `^0.5.5`.

## [1.5.1] — 2026-08-27

### Changed

- Updated `hyperttp` to `^0.5.4` and Bun/Undici transports to `^0.3.2`.

## [1.5.0] — 2026-08-25

### Added

- `TrackApi.streamTrack()` streams a direct track download as `AsyncGenerator<Uint8Array>` without buffering the full file.

### Changed

- Updated `hyperttp` to `^0.5.2` and Bun/Undici transports to `^0.3.1`.
- Default API client now uses Hyperttp `baseURL`; relative API paths and query parameters are passed directly to the client.
- Bun transport bypasses response-cache reads and writes for streaming requests.
- Undici transport normalizes uncompressed Node `Readable` bodies to Web `ReadableStream<Uint8Array>`.

### Fixed

- Cancelling `streamTrack()` early now cancels and unlocks the response reader.
- Wrapped playlist URLs with numeric IDs now use the user playlist endpoint instead of the UUID playlist endpoint.
- Wrapped track URL IDs are converted to numeric IDs after URL extraction.

## [1.4.0] — 2026-06-23

### Added

#### New API domains
- **LabelApi** — `getLabel`, `getLabelAlbums`, `getLabelArtists`
- **CreditApi** — `getTrackCredits`, `getClipCredits`
- **DisclaimerApi** — `getTrackDisclaimer`, `getAlbumDisclaimer`, `getArtistDisclaimer`, `getClipDisclaimer`
- **MetatagApi** — `getMetatags`, `getMetatag`, `getMetatagAlbums`, `getMetatagArtists`, `getMetatagPlaylists`
- **ClipApi** — `getClips`, `getClipsWillLike`
- **PinApi** — `getPins`, `pinAlbum`, `unpinAlbum`, `pinArtist`, `unpinArtist`, `pinPlaylist`, `unpinPlaylist`, `pinWave`, `unpinWave`
- **PresaveApi** — `getPresaves`, `addPresave`, `removePresave`
- **MusicHistoryApi** — `getMusicHistory`, `getMusicHistoryItems`
- **DeviceAuthApi** — `requestDeviceCode`, `pollDeviceToken`, `deviceAuth`
- **ConcertApi** — `getArtistConcerts`, `getConcertInfo`, `getConcertSkeleton`, `getConcertsFeed`, `getConcertsLocations`, `getConcertsTabConfig`

#### Extended existing APIs

**UserApi:**
- `likeTracks`, `unlikeTracks`, `getLikedAlbums`, `likeAlbums`, `unlikeAlbums`
- `getLikedArtists`, `likeArtists`, `unlikeArtists`
- `getLikedPlaylists`, `likePlaylists`, `unlikePlaylists`
- `getLikedClips`, `likeClip`, `unlikeClip`
- `dislikeTracks`, `undislikeTracks`
- `getDislikedArtists`, `dislikeArtist`, `undislikeArtist`

**AlbumApi:**
- `getAlbumSimilarEntities`, `getAlbumTrailer`

**ArtistApi:**
- `getArtistBriefInfo`, `getArtistDirectAlbums`, `getArtistSimilar`, `getArtistLinks`
- `getArtistAlsoAlbums`, `getArtistDiscographyAlbums`, `getArtistSafeDirectAlbums`
- `getArtistTrackIds`, `getArtistAbout`, `getArtistClips`, `getArtistDonation`
- `getArtistInfo`, `getArtistSkeleton`, `getArtistTrailer`

**PlaylistApi:**
- `getPlaylistRecommendations` (alias `getPlaylistNew`), `getPlaylists`
- `setPlaylistVisibility`, `setPlaylistDescription`, `getPlaylistKinds`
- `getPlaylistTrailer`, `getPlaylistSimilarEntities`, `getUserSettings`
- `collectiveJoin`

**TrackApi:**
- `getTrackLyrics`, `getTrackTrailer`, `getTrackFullInfo`

### Types
- Added all TypeScript types for new methods (flat interfaces, no classes)
- Added exports for all new types in `src/Types/index.ts`

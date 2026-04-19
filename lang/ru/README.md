# Yandex.Music API (Unofficial) для Node

Это Node.js обертка для [Yandex.Music](http://music.yandex.ru/) API, используемого в мобильных приложениях (iOS/Android).

## язык

[English](../../README.md), [**Русский**](./README.md)

## Установка

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

### Из GitHub

```sh
npm install github:Dirold2/yamd2#__dist__
```

## Использование

```js
import { YMApi } from "yamd2";
const api = new YMApi();

(async () => {
  try {
    await api.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });
    const result = await api.searchArtists("gorillaz");
    console.log({ result });
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
})();
```

Получите токен [здесь](https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d), а uid [здесь](https://mail.yandex.ru/).

## Доступные методы

Эта библиотека предоставляет следующие методы:

### Простой API

#### Пользователи

- getAccountStatus
- getFeed

#### Музыка

- getChart
- getNewReleases
- getPodcasts
- getGenres
- search
- searchArtists
- searchTracks
- searchAlbums
- searchAll

#### Плейлисты

- getNewPlaylists
- getPlaylist
- getPlaylists
- getUserPlaylists
- createPlaylist
- removePlaylist
- renamePlaylist
- addTracksToPlaylist
- removeTracksFromPlaylist

#### Треки

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

#### Альбомы

- getAlbums
- getAlbum
- getAlbumWithTracks

#### Исполнители

- getArtist
- getArtists

#### Станции

- getAllStationsList
- getRecomendedStationsList
- getStationTracks
- getStationInfo

### Обернутый API

Почти все методы обернутого API могут быть вызваны с ID сущности или URL

#### Треки

- getConcreteDownloadInfo
- getMp3DownloadInfo
- getMp3DownloadUrl

#### Плейлисты

- getPlaylist

#### Альбомы

- getAlbum
- getAlbumWithTracks

#### Исполнители

- getArtist

#### Прочее

- getShortenedLink

## Особенности WrappedYMApi

### Загрузка треков

```js
import { WrappedYMApi } from "yamd2";

const wrappedApi = new WrappedYMApi();
await wrappedApi.init({ access_token: "TOKEN", uid: 123 });

// Получить информацию для загрузки
const downloadInfo = await wrappedApi.getDownloadInfo("123456", {
  codec: "flac",
  quality: "lossless"
});

// Получить прямую ссылку для загрузки
const downloadUrl = await wrappedApi.getDownloadUrl("123456", {
  codec: "flac",
  quality: "lossless"
});

// Получить лучшую доступную ссылку (по приоритету кодеков)
const bestUrl = await wrappedApi.getBestDownloadUrl("123456");

// Получить ссылку для FFmpeg (RAW MP3)
const ffmpegUrl = await wrappedApi.getDownloadUrlForFFmpeg("123456");
```

### Поддержка URL

```js
// Все методы принимают как ID, так и URL
const track = await wrappedApi.getTrack("123456");
const trackFromUrl = await wrappedApi.getTrack(
  "https://music.yandex.ru/track/123456"
);

const playlist = await wrappedApi.getPlaylist("123456");
const playlistFromUrl = await wrappedApi.getPlaylist(
  "https://music.yandex.ru/users/username/playlists/123456"
);

const album = await wrappedApi.getAlbum("123456");
const albumFromUrl = await wrappedApi.getAlbum(
  "https://music.yandex.ru/album/123456"
);

const artist = await wrappedApi.getArtist("123456");
const artistFromUrl = await wrappedApi.getArtist(
  "https://music.yandex.ru/artist/123456"
);
```

### Конкретные методы загрузки

```js
// MP3 загрузка
const mp3Info = await wrappedApi.getMp3DownloadInfo("123456");
const mp3Url = await wrappedApi.getMp3DownloadUrl("123456");

// AAC загрузка
const aacInfo = await wrappedApi.getAacDownloadInfo("123456");
const aacUrl = await wrappedApi.getAacDownloadUrl("123456");

// FLAC загрузка
const flacInfo = await wrappedApi.getFlacDownloadInfo("123456");
const flacUrl = await wrappedApi.getFlacDownloadUrl("123456");
```

## Поддерживаемые кодеки

- **FLAC** - Без потерь, высокое качество
- **FLAC-MP4** - Без потерь в MP4 контейнере
- **AAC** - Стандартное сжатие
- **AAC-MP4** - AAC в MP4 контейнере
- **HE-AAC** - Высокая эффективность
- **HE-AAC-MP4** - HE-AAC в MP4 контейнере
- **MP3** - Широкая совместимость

## Приоритет кодеков

При использовании `getBestDownloadUrl()` кодеки проверяются в следующем порядке:

1. FLAC-MP4
2. FLAC
3. AAC-MP4
4. AAC
5. HE-AAC-MP4
6. HE-AAC
7. MP3

## Обработка ошибок

```js
import { YMApiError, ExtractionError, DownloadError } from "yamd2";

try {
  const result = await wrappedApi.getDownloadUrl("invalid-url");
} catch (error) {
  if (error instanceof ExtractionError) {
    console.log(`Не удалось извлечь ID из URL: ${error.input}`);
  } else if (error instanceof DownloadError) {
    console.log(
      `URL не найден для трека ${error.trackId} с кодеком ${error.codec}`
    );
  } else if (error instanceof YMApiError) {
    console.log(`Ошибка API: ${error.message}`);
  }
}
```

## Особенности

- **Автоматическое извлечение ID** из URL
- **Поддержка зашифрованных ссылок** для FLAC
- **Приоритет кодеков** для автоматического выбора лучшего качества
- **Обработка ошибок** с конкретными типами исключений
- **Поддержка FFmpeg** для RAW MP3 загрузки
- **Кэширование** для повышения производительности

## Благодарности

- [itsmepetrov/yandex-music-api](https://github.com/itsmepetrov/yandex-music-api)
- [MarshalX/yandex-music-api](https://github.com/MarshalX/yandex-music-api)
- [kontsevoye/ym-api](https://github.com/kontsevoye/ym-api)
- [kotisoff/ym-api-meowed](https://github.com/kotisoff/ym-api-meowed)

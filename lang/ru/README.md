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
import { YMApi, WrappedYMApi, Types } from "yamd2";

const api = new YMApi();

(async () => {
  try {
    await api.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });
    const result = await api.search.query("gorillaz", { type: "artist" });
    const artist = result.artists?.results?.[0];
    if (!artist) throw new Error("Исполнитель не найден");
    const tracks = await api.artists.getArtistTracks(artist.id);
    console.log(tracks);
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
})();
```

Получите токен [здесь](https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d), а uid [здесь](https://mail.yandex.ru/).

## Доступные методы

Методы сгруппированы по доменам — полям на экземпляре `YMApi`:

### api.auth

- `init(config)` — Аутентификация и инициализация

### api.account

- `getAccountStatus()` — Статус аккаунта
- `getFeed()` — Лента пользователя

### api.landing

- `getChart(chartType?)` — Чарт
- `getNewReleases()` — Новые альбомы
- `getNewPlaylists()` — Новые плейлисты
- `getPodcasts()` — Подкасты
- `getGenres()` — Список жанров

### api.search

- `query(q, options?)` — Поиск по всем или конкретному типу
- `artists(q, options?)` — Поиск исполнителей
- `tracks(q, options?)` — Поиск треков
- `albums(q, options?)` — Поиск альбомов
- `all(q, options?)` — Поиск по всем типам

### api.tracks

- `getTrack(trackId)` — Получить трек(и)
- `getSingleTrack(trackId)` — Получить один трек
- `getTrackSupplement(trackId)` — Доп. информация
- `getTrackDownloadInfo(trackId, quality?, canUseStreaming?)` — Информация о загрузке
- `getTrackDownloadInfoNew(trackId, quality?, codecs?, transport?)` — Новый endpoint
- `getTrackDirectLink(downloadUrl, short?)` — Прямая ссылка
- `streamTrack(trackUrl, signal?)` — Потоковое скачивание байтов трека без полной буферизации
- `getTrackDirectLinkNew(trackUrl)` — Прямая ссылка (новый формат)
- `getTrackShareLink(track)` — Ссылка для шаринга
- `getSimilarTracks(trackId)` — Похожие треки
- `getTrackSupplement(trackId)` — Доп. информация о треке

### api.albums

- `getAlbum(albumId, withTracks?)` — Получить альбом
- `getAlbums(albumIds)` — Несколько альбомов
- `getAlbumWithTracks(albumId)` — Альбом с треками

### api.artists

- `getArtist(artistId)` — Информация об исполнителе
- `getArtists(artistIds)` — Несколько исполнителей
- `getArtistTracks(artistId, options?)` — Треки исполнителя

### api.playlists

- `getPlaylist(playlistId, user?)` — Получить плейлист
- `getPlaylists(playlistIds, user?, options?)` — Несколько плейлистов
- `getUserPlaylists(userId)` — Плейлисты пользователя
- `createPlaylist(name, options?)` — Создать плейлист
- `removePlaylist(playlistId)` — Удалить плейлист
- `renamePlaylist(playlistId, name)` — Переименовать плейлист
- `addTracksToPlaylist(playlistId, tracks, revision, options?)` — Добавить треки
- `removeTracksFromPlaylist(playlistId, tracks, revision, options?)` — Удалить треки

### api.radio

- `getAllStationsList(language?)` — Все станции
- `getRecomendedStationsList()` — Рекомендованные станции
- `getStationTracks(stationId, queue?)` — Треки станции
- `getStationInfo(stationId)` — Информация о станции
- `createRotorSession(seeds, includeTracksInResponse?)` — Создать ротор-сессию
- `postRotorSessionTracks(sessionId, options)` — Получить треки сессии

### api.user

- `getLikedTracks(userId?)` — Понравившиеся треки
- `getDislikedTracks(userId?)` — Непонравившиеся треки

### api.queues

- `getQueues()` — Все очереди
- `getQueue(queueId)` — Конкретная очередь

### Обернутый API

Почти все методы обернутого API могут быть вызваны с ID сущности или URL

#### Треки

- getDownloadInfo — Информация о загрузке с поддержкой кодеков
- getDownloadUrl — Прямая ссылка или Blob URL расшифрованного файла
- getBestDownloadUrl — Лучшая доступная ссылка по приоритету кодеков
- getDownloadUrlForFFmpeg — Ссылка RAW MP3 для FFmpeg
- `streamTrack(track, options?, signal?)` — Потоковая выдача raw или AES-CTR-расшифрованных данных без полной буферизации трека
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
import { WrappedYMApi, Types } from "yamd2";

const wrappedApi = new WrappedYMApi();
await wrappedApi.init({ access_token: "TOKEN", uid: 123 });

// Получить информацию для загрузки
const downloadInfo = await wrappedApi.getDownloadInfo(123456, {
  codec: Types.DownloadTrackCodec.FLAC,
  quality: Types.DownloadTrackQuality.Lossless
});

// Получить прямую ссылку для загрузки
const downloadUrl = await wrappedApi.getDownloadUrl(123456, {
  codec: Types.DownloadTrackCodec.FLAC,
  quality: Types.DownloadTrackQuality.Lossless
});

// Получить лучшую доступную ссылку (по приоритету кодеков)
const bestUrl = await wrappedApi.getBestDownloadUrl(123456);

// Получить ссылку для FFmpeg (RAW MP3)
const ffmpegUrl = await wrappedApi.getDownloadUrlForFFmpeg(123456);
```

### Поддержка URL

```js
// Все методы принимают как ID, так и URL
const track = await wrappedApi.getTrack(123456);
const trackFromUrl = await wrappedApi.getTrack(
  "https://music.yandex.ru/track/123456"
);

const playlist = await wrappedApi.getPlaylist(123456);
const playlistFromUrl = await wrappedApi.getPlaylist(
  "https://music.yandex.ru/users/username/playlists/123456"
);

const album = await wrappedApi.getAlbum(123456);
const albumFromUrl = await wrappedApi.getAlbum(
  "https://music.yandex.ru/album/123456"
);

const artist = await wrappedApi.getArtist(123456);
const artistFromUrl = await wrappedApi.getArtist(
  "https://music.yandex.ru/artist/123456"
);
```

### Конкретные методы загрузки

```js
// MP3 загрузка
const mp3Info = await wrappedApi.getMp3DownloadInfo(123456);
const mp3Url = await wrappedApi.getMp3DownloadUrl(123456);

// AAC загрузка
const aacInfo = await wrappedApi.getAacDownloadInfo(123456);
const aacUrl = await wrappedApi.getAacDownloadUrl(123456);

// FLAC загрузка
const flacInfo = await wrappedApi.getFlacDownloadInfo(123456);
const flacUrl = await wrappedApi.getFlacDownloadUrl(123456);
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

## Потоковое скачивание трека

Есть два API для потоковой загрузки.

### Потоковая загрузка по прямой ссылке

`api.tracks.streamTrack()` выдаёт байты direct-download ответа без буферизации трека целиком. Сначала получите прямую ссылку, затем обрабатывайте чанки `Uint8Array`:

```ts
const trackId = 14329703;
const downloadInfo = await api.tracks.getTrackDownloadInfo(trackId);
const source = downloadInfo[0];

if (!source) throw new Error("Информация для скачивания недоступна");

const directUrl = await api.tracks.getTrackDirectLink(source.downloadInfoUrl);
const controller = new AbortController();

for await (const chunk of api.tracks.streamTrack(directUrl, controller.signal)) {
  // Сохраните или обработайте chunk: Uint8Array
}
```

### Потоковая загрузка через WrappedYMApi с расшифровкой

`WrappedYMApi.streamTrack()` автоматически получает информацию о загрузке и выдаёт raw или AES-CTR-расшифрованные данные. Рекомендуется использовать его для зашифрованных кодеков, например FLAC и AAC:

```ts
import { Types, WrappedYMApi } from "yamd2";

const wrappedApi = new WrappedYMApi();
await wrappedApi.init({ access_token: "EXAMPLE_TOKEN", uid: 0 });

const controller = new AbortController();
for await (const chunk of wrappedApi.streamTrack(14329703, {
  codec: Types.DownloadTrackCodec.FLACMP4,
  quality: Types.DownloadTrackQuality.Lossless,
}, controller.signal)) {
  // Сохраните или обработайте расшифрованный chunk: Uint8Array
}
```

По умолчанию используются MP3, качество lossless и `forceRaw: false`; конфигурация MP3 выбирает raw-транспорт. Параметры `codec`, `quality` и `forceRaw` задаются в `options`. Автоматического перебора кодеков у этого метода нет.

Для зашифрованных загрузок метод проверяет AES-ключ до начала скачивания и не создаёт полный буфер файла или Blob URL. Сигнал отменяет запрос аудио, но не уже выполняющийся запрос метаданных. Выход из цикла закрывает исходный поток. Оба потоковых API работают в Bun и Node.js; низкоуровневый метод сам не расшифровывает байты.

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

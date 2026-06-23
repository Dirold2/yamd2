import WrappedYMApi from "../src/WrappedYMApi";
import config from "./config";

const wrappedApi = new WrappedYMApi();

(async () => {
  try {
    await wrappedApi.init(config.user);

    const album = await wrappedApi.getApi().albums.getAlbumWithTracks(3421932);

    console.log(album);

    // Проверка, что ответ валидный
    if (
      !album ||
      !album.title ||
      !album.volumes ||
      album.volumes.length === 0
    ) {
      throw new Error("Invalid album response");
    }

    console.log(`${album.title}\n`);
    album.volumes.forEach((volume, _vi) => {
      for (const [i, track] of Object.entries(volume)) {
        if (!track.title) throw new Error(`Track ${i} is missing title`);
        console.log(`${Number(i) + 1}. ${track.title}`);
      }
    });

    // New methods
    const similar = await wrappedApi
      .getApi()
      .albums.getAlbumSimilarEntities(album.id);
    console.log(
      `Similar entities: ${similar.albums?.length ?? 0} albums, ${similar.artists?.length ?? 0} artists`
    );

    const trailer = await wrappedApi.getApi().albums.getAlbumTrailer(album.id);
    console.log(`Album trailer: ${trailer?.title ?? "none"}`);

    // Если дошли сюда — тест пройден
    process.exitCode = 0;
  } catch (e: any) {
    console.error(`api error: ${e?.message ?? String(e)}`);
    process.exitCode = 1; // Тест считается проваленным
  }
})();

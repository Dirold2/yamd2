import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get label by ID (1 = "Stingray Music", known to exist)
    const label = await api.labels.getLabel(1);
    console.log(`Label: ${label.name} (ID: ${label.id})`);

    // Get label albums
    const albums = await api.labels.getLabelAlbums(label.id, { pageSize: 5 });
    console.log(`Albums on label: ${(albums as any).total ?? albums.albums?.length}`);

    // Get label artists
    const artists = await api.labels.getLabelArtists(label.id, { pageSize: 5 });
    console.log(`Artists on label: ${(artists as any).total ?? artists.artists?.length}`);

    console.log("✔ Label smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Label smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

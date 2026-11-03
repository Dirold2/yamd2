import { YMApi, type Types } from "../src/index.js";
import config from "./config.js";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    const queries: { q: string; type: Types.SearchType }[] = [
      { q: "Скриптонит", type: "artist" },
      { q: "gorillaz", type: "album" },
      { q: "cristmas", type: "track" }
    ];

    for (const { q, type } of queries) {
      const result = await api.search.query(q, { type });
      if (type === "artist" && result.artists?.results?.length) {
        console.log(
          `✔ Artist search "${q}" returned ${result.artists.results.length}`
        );
      } else if (type === "album" && "albums" in result && result.albums?.results?.length) {
        console.log(
          `✔ Album search "${q}" returned ${result.albums.results.length}`
        );
      } else if (type === "track" && "tracks" in result && result.tracks?.results?.length) {
        console.log(
          `✔ Track search "${q}" returned ${result.tracks.results.length}`
        );
      } else {
        console.error(`❌ Search "${q}" (${type}) returned no results`);
        process.exitCode = 1;
      }
    }
  } catch (e: any) {
    console.error(`❌ API error: ${e?.message ?? String(e)}`);
    process.exitCode = 1;
  }
})();

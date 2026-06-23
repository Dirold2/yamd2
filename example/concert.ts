import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get concert locations
    const locations = await api.concerts.getConcertsLocations();
    console.log(`Concert locations: ${locations.locations?.length ?? 0} locations`);

    // Get concerts feed
    const feed = await api.concerts.getConcertsFeed();
    console.log(`Concerts feed: ${feed.items?.length ?? 0} concerts`);

    // Get tab config
    const tabConfig = await api.concerts.getConcertsTabConfig();
    console.log(`Tab config loaded: ${tabConfig.tabs?.length ?? 0} tabs`);

    console.log("✔ Concert smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Concert smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

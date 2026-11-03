import { YMApi } from "../src/index.js";
import config from "./config.js";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Find a track first
    const search = await api.search.query("gorillaz feel good inc", { type: "track" });
    const track = search.tracks?.results?.[0];
    if (!track?.id) throw new Error("Track not found");

    // Get track credits
    const credits = await api.credits.getTrackCredits(track.id);
    console.log(`Credits for track "${track.title}":`);
    for (const credit of credits.credits) {
      console.log(`  ${credit.title}: ${credit.value}`);
    }

    console.log("✔ Credit smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Credit smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

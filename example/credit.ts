import { YMApi } from "../src";
import config from "./config";

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
    console.log(`  Artists: ${credits.artists?.map((a: any) => a.name).join(", ")}`);
    console.log(`  Composers: ${credits.composers?.map((c: any) => c.name).join(", ")}`);

    console.log("✔ Credit smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Credit smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

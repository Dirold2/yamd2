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

    // Get track disclaimer
    const disclaimer = await api.disclaimers.getTrackDisclaimer(track.id);
    console.log(`Track disclaimer: ${disclaimer.text ?? "none"}`);

    console.log("✔ Disclaimer smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Disclaimer smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

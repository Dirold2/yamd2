import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get pins
    const pins = await api.pins.getPins();
    console.log(`Pins: ${pins.pins?.length ?? 0} pinned`);

    console.log("✔ Pin smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Pin smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

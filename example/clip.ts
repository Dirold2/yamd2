import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get clips the user will like
    const clips = await api.clips.getClipsWillLike(0, 5);
    console.log(`Clips will like: ${clips.clips?.length ?? 0} clips`);

    console.log("✔ Clip smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Clip smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

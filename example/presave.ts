import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get presaved albums
    const presaves = await api.presaves.getPresaves();
    console.log(`Presaves: ${presaves.presaves?.length ?? 0} albums presaved`);

    console.log("✔ Presave smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Presave smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

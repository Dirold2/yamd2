import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get music history (page 0 for most recent)
    const history = (await api.musicHistory.getMusicHistory(0, 10)) ?? {};
    const tabs = (history as any).tabs?.length ?? 0;
    console.log(`Music history: ${tabs} tabs`);

    if (tabs > 0) {
      const firstTab = (history as any).tabs![0];
      const groups = firstTab.groups?.length ?? 0;
      console.log(`  First tab groups: ${groups}`);

      if (groups > 0) {
        const firstGroup = firstTab.groups![0];
        console.log(`  First group items: ${firstGroup.items?.length ?? 0}`);
      }
    }

    console.log("✔ Music history smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Music history smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

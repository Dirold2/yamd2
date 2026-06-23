import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get metatag trees
    const metatags = await api.metatags.getMetatags();
    const trees = metatags.trees ?? [];
    console.log(`Metatag trees: ${trees.length}`);

    if (trees.length > 0) {
      trees.forEach((t) => console.log(`  ${t.title}: ${t.leaves?.length ?? 0} tags`));

      // Get specific metatag by tag name
      const firstLeaf = trees[0].leaves?.[0];
      if (firstLeaf?.tag) {
        const metatag = await api.metatags.getMetatag(firstLeaf.tag, { tracksCount: 5 });
        const title = typeof metatag.title === "string" ? metatag.title : metatag.title?.title;
        console.log(`Metatag "${title ?? firstLeaf.title}" loaded`);
      }
    }

    console.log("✔ Metatag smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ Metatag smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

import { resolveObjectURL } from "buffer";
import { WrappedYMApi } from "../src/index.js";

const WrappedApi = new WrappedYMApi();

const access_token = process.env.YM_ACCESS_TOKEN as string;
const uid = Number(process.env.YM_UID);

(async () => {
  try {
    if (!access_token || !uid) {
      throw new Error("YM_ACCESS_TOKEN and YM_UID must be set");
    }

    await WrappedApi.init({ access_token, uid });

    const trackId = 118618025;

    const started = performance.now();
    const track = await WrappedApi.getBestDownloadUrl(trackId);

    if (!track) throw new Error("Decrypted track URL not available");

    try {
      const blob = resolveObjectURL(track);
      if (!blob || blob.size === 0) throw new Error("Decrypted Blob not available or empty");

      console.log(
        `✔ Decrypted Blob: ${blob.size} bytes (${Math.round(performance.now() - started)} ms)`,
      );
    } finally {
      URL.revokeObjectURL(track);
    }

    process.exitCode = 0;
  } catch (err: any) {
    console.error("❌ API error:", err?.message ?? err);
    process.exitCode = 1;
  }
})();

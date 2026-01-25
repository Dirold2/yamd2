import { resolveObjectURL } from "buffer";
import { WrappedYMApi, YMApi } from "../src";

const WrappedApi = new WrappedYMApi();
const api = new YMApi();

const access_token = process.env.YM_ACCESS_TOKEN as string;
const uid = Number(process.env.YM_UID);

(async () => {
  try {
    if (!access_token || !uid) {
      throw new Error("YM_ACCESS_TOKEN and YM_UID must be set");
    }

    await WrappedApi.init({ access_token, uid });
    await api.init({ access_token, uid });

    const trackId = 118618025;

    const track = await WrappedApi.getBestDownloadUrl(Number(trackId));

    if (track) {
      console.log(track as string);

      const blob = resolveObjectURL(track as string);
      const arrayBuffer = await blob?.arrayBuffer();

      console.log(`\n \nDecrypted Blob\n`);
      console.log(arrayBuffer, `\n`);
    } else {
      console.error("Decrypted buffer not available");
      process.exitCode = 1;
    }

    process.exitCode = 0;
  } catch (err: any) {
    console.error("❌ API error:", err?.message ?? err);
    process.exitCode = 1;
  }
})();

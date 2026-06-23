import WrappedYMApi from "../src/WrappedYMApi";
import config from "./config";
const wrappedApi = new WrappedYMApi();

(async () => {
  try {
    await wrappedApi.init(config.user);

    const artist = await wrappedApi.getArtist(800020);
    console.log(artist.artist.name);

    // New methods
    const briefInfo = await wrappedApi.getApi().artists.getArtistBriefInfo(800020);
    console.log(`Brief info: ${briefInfo.artist.name}, similar: ${briefInfo.similarArtists?.length ?? 0}`);

    const similar = await wrappedApi.getApi().artists.getArtistSimilar(800020);
    console.log(`Similar artists: ${similar.similar?.length ?? 0}`);

    try {
      const about = await wrappedApi.getApi().artists.getArtistAbout(800020);
      const text = (about as any).text ?? (about as any).description ?? "";
      console.log(`About: ${text ? text.slice(0, 50) + "..." : "none"}`);
    } catch {
      console.log("About: not available");
    }
  } catch (e: any) {
    console.log(`api error: ${e?.message ?? String(e)}`);
  }
})();

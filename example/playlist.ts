import { YMApi } from "../src";
import config from "./config";
const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);
    console.log(`Logged in as: ${config.user.uid}`);

    const playlist = await api.playlists.createPlaylist("Test Playlist", {
      visibility: "public"
    });
    console.log(`Created playlist: ${playlist.title} (Kind: ${playlist.kind}, Rev: ${playlist.revision})`);

    const tracks = [
      { id: 20599729, albumId: 2347459 },
      { id: 20069589, albumId: 2265364 }
    ];
    
    console.log("Adding tracks...");
    const updatedPlaylist = await api.playlists.addTracksToPlaylist(
      playlist.kind,
      tracks,
      playlist.revision!
    );

    if (updatedPlaylist.revision! <= playlist.revision!) {
      throw new Error(`Revision didn't increase! Old: ${playlist.revision}, New: ${updatedPlaylist.revision}`);
    }

    console.log("Verifying tracks existence...");
    await new Promise(resolve => setTimeout(resolve, 500));

    const fetchedPlaylists = await api.playlists.getPlaylists([playlist.kind], undefined, {
      "rich-tracks": true
    });
    
    const target = fetchedPlaylists[0];
    const actualTrackCount = target.tracks?.length ?? 0;

    console.log(`Tracks in playlist after fetch: ${actualTrackCount}`);

    if (actualTrackCount !== tracks.length) {
      console.dir(target, { depth: 2 }); 
      throw new Error(`Track mismatch! Expected ${tracks.length}, got ${actualTrackCount}`);
    }

    // New methods
    const recommendations = await api.playlists.getPlaylistRecommendations(playlist.kind);
    console.log(`Recommendations: ${recommendations.recommendations?.length ?? 0} tracks`);

    const userSettings = await api.playlists.getUserSettings();
    if (userSettings) {
      console.log(`User settings loaded: ${Object.keys(userSettings).length} keys`);
    } else {
      console.log("User settings: not available");
    }

    const kinds = await api.playlists.getPlaylistKinds();
    console.log(`Playlist kinds: ${kinds.length} playlists`);

    console.log("Cleaning up...");
    await api.playlists.removeTracksFromPlaylist(
      playlist.kind,
      tracks,
      target.revision!
    );
    
    await api.playlists.removePlaylist(playlist.kind);

    console.log("✔ Playlist smoke test passed");
    process.exitCode = 0;
  } catch (err: any) {
    console.error("❌ Playlist smoke test failed:");
    if (err.body) console.error("Response body:", JSON.stringify(err.body, null, 2));
    console.error(err);
    process.exitCode = 1;
  }
})();
import { YMApi } from "../src";
import config from "./config";

const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);

    // Get liked tracks
    const likedTracks = await api.user.getLikedTracks();
    console.log(`Liked tracks: ${likedTracks.library?.tracks?.length ?? 0}`);

    // Get liked albums
    const likedAlbums = await api.user.getLikedAlbums();
    console.log(`Liked albums: ${likedAlbums.length}`);

    // Get liked artists
    const likedArtists = await api.user.getLikedArtists();
    console.log(`Liked artists: ${likedArtists.length}`);

    // Get liked playlists
    const likedPlaylists = await api.user.getLikedPlaylists();
    console.log(`Liked playlists: ${likedPlaylists.length}`);

    // Get disliked tracks
    const dislikedTracks = await api.user.getDislikedTracks();
    console.log(`Disliked tracks: ${dislikedTracks.library?.tracks?.length ?? 0}`);

    // Get disliked artists
    const dislikedArtists = await api.user.getDislikedArtists();
    console.log(`Disliked artists: ${dislikedArtists.length}`);

    // Like/unlike a track
    const search = await api.search.query("gorillaz feel good inc", { type: "track" });
    const track = search.tracks?.results?.[0];
    if (track?.id) {
      await api.user.likeTracks([track.id]);
      console.log(`Liked track ${track.id}`);
      await api.user.unlikeTracks([track.id]);
      console.log(`Unliked track ${track.id}`);
    }

    // Dislike/undislike a track
    if (track?.id) {
      await api.user.dislikeTracks([track.id]);
      console.log(`Disliked track ${track.id}`);
      await api.user.undislikeTracks([track.id]);
      console.log(`Undisliked track ${track.id}`);
    }

    console.log("✔ User likes smoke test passed");
    process.exitCode = 0;
  } catch (e: any) {
    console.error("❌ User likes smoke test failed:", e?.message ?? e);
    process.exitCode = 1;
  }
})();

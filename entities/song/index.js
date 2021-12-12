import SongModel from "../../models/song.js";
import LyricsModel from "../../models/lyrics.js";

import makeSongList from "./song-list.js";
import makeSongsEndpointsHandler from "./song-endpoints.js";
import makeArtistSongsEndpointHandler from "./artist-song-endpoints.js";

const songList = makeSongList({ SongModel, LyricsModel });
const songEndpointHandler = makeSongsEndpointsHandler(songList);

export const artistSongsEndpointHandler =
  makeArtistSongsEndpointHandler(songList);

export default songEndpointHandler;

import SongModel from "../../models/song.js";

import makeSongList from "./song-list.js";
import makeSongsEndpointsHandler from "./song-endpoints.js";

const songList = makeSongList({ SongModel });
const songEndpointHandler = makeSongsEndpointsHandler(songList);

export default songEndpointHandler;

import LyricsModel from "../../models/lyrics.js";

import makeLyricsList from "./lyrics-list.js";
import makeLyricsEndPointsHandler from "./lyrics-endpoints.js";

const lyricsList = makeLyricsList({ LyricsModel });
const lyricsEndpointHandler = makeLyricsEndPointsHandler(lyricsList);

export default lyricsEndpointHandler;

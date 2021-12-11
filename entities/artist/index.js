import SongModel from "../../models/song.js";
import ArtistModel from "../../models/artist.js";

import makeArtistList from "./artist-list.js";
import makeArtistsEndpointsHandler from "./artist-endpoint.js";

const artistList = makeArtistList({ ArtistModel, SongModel });
const artistsEndpointHandler = makeArtistsEndpointsHandler(artistList);

export default artistsEndpointHandler;

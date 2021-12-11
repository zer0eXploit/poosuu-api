import ArtistModel from "../../models/artist.js";

import makeArtistList from "./artist-list.js";
import makeArtistsEndpointsHandler from "./artist-endpoint.js";

const artistList = makeArtistList({ ArtistModel });
const artistsEndpointHandler = makeArtistsEndpointsHandler(artistList);

export default artistsEndpointHandler;

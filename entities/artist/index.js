import SongModel from "../../models/song.js";
import ArtistModel from "../../models/artist.js";

import makeArtistList from "./artist-list.js";
import makeArtistsEndpointsHandler from "./artist-endpoint.js";
import makeArtistCoverEndpointHandler from "./artist-cover-endpoint.js";
import makeSpotifyArtistsInfoEndpointHandler from "./spotify-artist-endpoints.js";

const artistList = makeArtistList({ ArtistModel, SongModel });
const artistsEndpointHandler = makeArtistsEndpointsHandler(artistList);

export const spotifyArtistsEndpointHandler =
  makeSpotifyArtistsInfoEndpointHandler();

export const artistCoverEndpointHandler = makeArtistCoverEndpointHandler();

export default artistsEndpointHandler;

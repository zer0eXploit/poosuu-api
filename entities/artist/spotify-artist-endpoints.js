import SpotifyUtils from "../../helpers/spotify.js";

import { checkAPIKey } from "../../helpers/auth.js";
import { makeHttpResponse } from "../../helpers/http-response.js";

const makeSpotifyArtistsInfoEndpointHandler = () => {
  const getSearchSpotifyArtists = async (httpRequest) => {
    await checkAPIKey(httpRequest);

    const {
      query: { q, limit, page },
    } = httpRequest;

    const searchData = {
      q,
      limit,
      // to calculate offset
      page: page && page > 1 ? page : 0,
      type: "artist",
    };
    const artists = await SpotifyUtils.search(searchData);

    return makeHttpResponse(artists);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getSearchSpotifyArtists(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeSpotifyArtistsInfoEndpointHandler;

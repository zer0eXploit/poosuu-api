import SpotifyUtils from "../../helpers/spotify.js";

import { checkAPIKey } from "../../helpers/auth.js";
import { ResourceNotFoundError } from "../../helpers/errors.js";
import { makeHttpResponse } from "../../helpers/http-response.js";

const makeSpotifySongInfoEndpointHandler = () => {
  const getSearchSpotifySongs = async (httpRequest) => {
    await checkAPIKey(httpRequest);

    const {
      query: { q, limit, page },
    } = httpRequest;

    const searchData = {
      q,
      limit,
      // to calculate offset
      page: page && page > 1 ? page : 0,
      type: "track",
    };
    const songs = await SpotifyUtils.search(searchData);

    if (!songs) throw new ResourceNotFoundError();
    return makeHttpResponse(songs);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getSearchSpotifySongs(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeSpotifySongInfoEndpointHandler;

import { makeHttpResponse } from "../../helpers/http-response.js";
import { ResourceNotFoundError } from "../../helpers/errors.js";
import { checkAPIKey } from "../../helpers/auth.js";

const makeArtistSongsEndpointHandler = (songList) => {
  const getArtistSong = async (httpRequest) => {
    await checkAPIKey(httpRequest);

    const {
      params: { id },
      query,
    } = httpRequest;
    const song = await songList.getArtistSongs(id, query);
    if (!song) throw new ResourceNotFoundError();
    return makeHttpResponse(song);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getArtistSong(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeArtistSongsEndpointHandler;

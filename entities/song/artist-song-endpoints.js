import { makeHttpResponse } from "../../helpers/http-response.js";
import { ResourceNotFoundError } from "../../helpers/errors.js";

const makeArtistSongsEndpointHandler = (songList) => {
  const getArtistSong = async (httpRequest) => {
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

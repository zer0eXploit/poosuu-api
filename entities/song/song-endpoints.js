import makeSong from "./song.js";

import {
  makeHttpResponse,
  makeEmptyHttpResponse,
} from "../../helpers/http-response.js";
import { checkAuthorization } from "../../helpers/auth.js";

import {
  ResourceNotFoundError,
  AccessTokenError,
} from "../../helpers/errors.js";

// TODO: POST TO ALGOLIA INDEX

const makeSongEndpointsHandler = (songList) => {
  const getSong = async (httpRequest) => {
    const {
      params: { id },
      query,
    } = httpRequest;
    const song = await songList.getSong(id, query);
    if (!song) throw new ResourceNotFoundError();
    return makeHttpResponse(song);
  };

  const createSong = async (httpRequest) => {
    const { body, headers } = httpRequest;
    checkAuthorization(headers);
    const validSong = makeSong(body);
    const created = await songList.addSong(validSong);
    return makeHttpResponse(created);
  };

  const updateSong = async (httpRequest) => {
    const {
      body,
      params: { id },
    } = httpRequest;
    checkAuthorization(headers);
    const song = makeSong(body);
    const updated = await songList.updateSong(id, song);
    if (!updated) throw new ResourceNotFoundError();
    return makeHttpResponse(updated);
  };

  const deleteSong = async (httpRequest) => {
    const {
      params: { id },
    } = httpRequest;
    checkAuthorization(headers);
    await songList.deleteSong(id);
    return makeEmptyHttpResponse();
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getSong(httpRequest);

      case "PUT":
        return updateSong(httpRequest);

      case "POST":
        return createSong(httpRequest);

      case "DELETE":
        return deleteSong(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeSongEndpointsHandler;

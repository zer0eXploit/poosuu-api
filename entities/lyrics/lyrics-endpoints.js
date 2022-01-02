import makeLyrics from "./lyrics.js";

import {
  makeHttpResponse,
  makeEmptyHttpResponse,
  makeErrorHttpResponse,
} from "../../helpers/http-response.js";
import { checkAuthorization, checkAPIKey } from "../../helpers/auth.js";
import { ResourceNotFoundError } from "../../helpers/errors.js";

const makeLyricsEndPointsHandler = (lyricsList) => {
  const getLyricsById = async (httpRequest) => {
    await checkAPIKey(httpRequest);
    const { id } = httpRequest.params || {};
    const lyrics = await lyricsList.findById(id);
    if (!lyrics) throw new ResourceNotFoundError();
    return makeHttpResponse(lyrics);
  };

  const addNewLyrics = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const { body } = httpRequest;
    const lyrics = makeLyrics(body);
    const addedLyrics = await lyricsList.add(lyrics);
    return makeHttpResponse(addedLyrics);
  };

  const updateLyrics = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const {
      body,
      params: { id },
    } = httpRequest;
    const lyrics = makeLyrics(body);
    const updated = await lyricsList.findByIdAndUpdate(id, lyrics);

    if (!updated) throw new ResourceNotFoundError();

    return makeHttpResponse(updated);
  };

  const deleteLyrics = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const {
      params: { id },
    } = httpRequest;
    const resp = await lyricsList.findByIdAndDelete(id);
    if (resp) return makeHttpResponse(resp);
    return makeEmptyHttpResponse();
  };

  const handle = async (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getLyricsById(httpRequest);

      case "POST":
        return addNewLyrics(httpRequest);

      case "PUT":
        return updateLyrics(httpRequest);

      case "DELETE":
        return deleteLyrics(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeLyricsEndPointsHandler;

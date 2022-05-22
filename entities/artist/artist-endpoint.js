import makeArtist from "./artist.js";

import {
  makeHttpResponse,
  makeEmptyHttpResponse,
} from "../../helpers/http-response.js";
import {
  checkAuthorization,
  checkAPIKey,
  extractTokenFromHeader,
} from "../../helpers/auth.js";
import { ResourceNotFoundError } from "../../helpers/errors.js";

// TODO: POST TO ALGOLIA INDEX

const makeArtistEndpointsHandler = (artistList) => {
  const getArtist = async (httpRequest) => {
    await checkAPIKey(httpRequest);

    const token = extractTokenFromHeader(httpRequest.headers);
    const select = token ? null : "-coverDeleteUrl";

    const {
      params: { id },
      query,
    } = httpRequest;
    const artist = await artistList.getArtist(id, query, select);
    if (!artist) throw new ResourceNotFoundError();
    return makeHttpResponse(artist);
  };

  const createArtist = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const { body } = httpRequest;
    const validArtist = makeArtist(body);
    const created = await artistList.createArtist(validArtist);
    return makeHttpResponse(created);
  };

  const updateArtist = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const {
      body,
      params: { id },
    } = httpRequest;
    const artist = makeArtist(body);
    const updated = await artistList.updateArtist(id, artist);
    if (!updated) throw new ResourceNotFoundError();
    return makeHttpResponse(updated);
  };

  const deleteArtist = async (httpRequest) => {
    const { headers } = httpRequest;
    checkAuthorization(headers);

    const {
      params: { id },
    } = httpRequest;
    const resp = await artistList.deleteArtist(id);
    if (resp) return makeHttpResponse(resp);
    return makeEmptyHttpResponse();
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getArtist(httpRequest);

      case "PUT":
        return updateArtist(httpRequest);

      case "POST":
        return createArtist(httpRequest);

      case "DELETE":
        return deleteArtist(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeArtistEndpointsHandler;

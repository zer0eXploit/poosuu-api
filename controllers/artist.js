import asyncWrap from "express-async-handler";

import artistsEndpointHandler, {
  spotifyArtistsEndpointHandler,
  artistCoverEndpointHandler,
} from "../entities/artist/index.js";
import { artistSongsEndpointHandler } from "../entities/song/index.js";

import adaptRequest from "../helpers/adapt-request.js";

const handleArtistsEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await artistsEndpointHandler(httpRequest);

  res.set(headers).status(status).send(data);
});

export const handleArtistSongsEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await artistSongsEndpointHandler(
    httpRequest
  );

  res.set(headers).status(status).send(data);
});

export const handleSpotifyArtistsEndpoint = asyncWrap(
  async (req, res, _next) => {
    const httpRequest = adaptRequest(req);
    const { headers, status, data } = await spotifyArtistsEndpointHandler(
      httpRequest
    );

    res.set(headers).status(status).send(data);
  }
);

export const handleArtistCoverEndpoint = asyncWrap(async (req, res, _next) => {
  console.log("REQUEST HIT!");
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await artistCoverEndpointHandler(
    httpRequest
  );

  res.set(headers).status(status).send(data);
});

export default handleArtistsEndpoint;

import asyncWrap from "express-async-handler";

import artistsEndpointHandler from "../entities/artist/index.js";

import adaptRequest from "../helpers/adapt-request.js";

const handleArtistsEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await artistsEndpointHandler(httpRequest);

  res.set(headers).status(status).send(data);
});

export default handleArtistsEndpoint;

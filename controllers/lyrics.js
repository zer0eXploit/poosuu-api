import asyncWrap from "express-async-handler";

import lyricsEndpointHandler from "../entities/lyrics/index.js";

import adaptRequest from "../helpers/adapt-request.js";

const handleLyricsEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await lyricsEndpointHandler(httpRequest);

  res.set(headers).status(status).send(data);
});

export default handleLyricsEndpoint;

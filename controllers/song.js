import asyncWrap from "express-async-handler";

import songEndpointHandler from "../entities/song/index.js";

import adaptRequest from "../helpers/adapt-request.js";

const handleSongEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await songEndpointHandler(httpRequest);

  res.set(headers).status(status).send(data);
});

export default handleSongEndpoint;

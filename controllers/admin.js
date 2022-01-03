import asyncWrap from "express-async-handler";

import adminsEndpointHandler from "../entities/admin/index.js";
import {
  adminLoginEndpointHandler,
  adminAPIKeyEndpointHandler,
  adminPasswordResetEnpointsHandler,
} from "../entities/admin/index.js";

import adaptRequest from "../helpers/adapt-request.js";

const handleAdminsEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await adminsEndpointHandler(httpRequest);

  res.set(headers).status(status).send(data);
});

export const handleAdminLoginEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await adminLoginEndpointHandler(
    httpRequest
  );

  res.set(headers).status(status).send(data);
});

export const handleAdminAPIKeyEndpoint = asyncWrap(async (req, res, _next) => {
  const httpRequest = adaptRequest(req);
  const { headers, status, data } = await adminAPIKeyEndpointHandler(
    httpRequest
  );

  res.set(headers).status(status).send(data);
});

export const handleadminPasswordResetEnpoint = asyncWrap(
  async (req, res, _next) => {
    const httpRequest = adaptRequest(req);
    const { headers, status, data } = await adminPasswordResetEnpointsHandler(
      httpRequest
    );

    res.set(headers).status(status).send(data);
  }
);

export default handleAdminsEndpoint;

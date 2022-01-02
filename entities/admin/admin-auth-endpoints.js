import requiredParam from "../../helpers/required-param.js";

import { client } from "../../config/redis.js";
import { isValidEmail } from "../../helpers/validation.js";
import {
  makeHttpResponse,
  makeErrorHttpResponse,
  makeEmptyHttpResponse,
} from "../../helpers/http-response.js";
import {
  pwCorrect,
  generateToken,
  generateAPIKey,
  checkAuthorization,
} from "../../helpers/auth.js";

export const makeAdminLoginEndpointHandler = (adminList) => {
  const postLogin = async (httpRequest) => {
    const {
      body: { usernameOrEmail, password },
    } = httpRequest;

    if (!usernameOrEmail) requiredParam("usernameOrEmail");
    if (!password) requiredParam("password");

    let admin;

    if (isValidEmail(usernameOrEmail)) {
      admin = await adminList.getAdminByEmail(usernameOrEmail);
    } else {
      admin = await adminList.getAdminByUsername(usernameOrEmail);
    }

    if (!admin) return makeHttpResponse({ message: "Bad credentials." }, 401);

    if (pwCorrect(password, admin.password)) {
      const payload = { adminId: admin._id };
      const token = generateToken(payload);
      return makeHttpResponse({ token });
    }

    return makeHttpResponse({ message: "Bad credentials." }, 401);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "POST":
        return postLogin(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export const makeAdminAPIKeyEndpointHandler = () => {
  const getAPIKeys = async (httpRequest) => {
    const {
      headers,
      params: { apiKey },
    } = httpRequest;
    checkAuthorization(headers);

    if (apiKey) {
      const domain = await client.get(apiKey);
      if (domain) return makeHttpResponse({ apiKey, domain }, 200);

      return makeErrorHttpResponse({
        status: 404,
        errorMessage: "API key not found.",
      });
    }
    const keys = await client.keys("*");
    return makeHttpResponse({ keys }, 200);
  };

  const postAPIKeys = async (httpRequest) => {
    const {
      body: { host },
      headers,
    } = httpRequest;

    checkAuthorization(headers);

    if (!host) requiredParam("host");

    const key = generateAPIKey();
    await client.set(key, host);

    return makeHttpResponse({ key, host }, 201);
  };

  const putAPIKeys = async (httpRequest) => {
    const {
      headers,
      params: { apiKey },
      body: { host },
    } = httpRequest;
    checkAuthorization(headers);

    if (!host) requiredParam("host");

    let existing = await client.get(apiKey);

    if (existing) await client.set(apiKey, host);
    else {
      const key = generateAPIKey();
      await client.set(key, host);
      return makeHttpResponse({ key, host }, 200);
    }

    return makeHttpResponse({ apiKey, host }, 200);
  };

  const deleteAPIKeys = async (httpRequest) => {
    const {
      headers,
      params: { apiKey },
    } = httpRequest;
    checkAuthorization(headers);

    apiKey && (await client.del(apiKey));

    return makeEmptyHttpResponse();
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getAPIKeys(httpRequest);

      case "POST":
        return postAPIKeys(httpRequest);

      case "PUT":
        return putAPIKeys(httpRequest);

      case "DELETE":
        return deleteAPIKeys(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

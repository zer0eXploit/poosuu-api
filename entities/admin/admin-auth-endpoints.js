import requiredParam from "../../helpers/required-param.js";

import { client } from "../../config/redis.js";
import { isValidEmail } from "../../helpers/validation.js";
import { makeHttpResponse } from "../../helpers/http-response.js";
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
  const postCreateAPIKey = async (httpRequest) => {
    const {
      body: { host },
      headers,
    } = httpRequest;

    checkAuthorization(headers);

    if (!host) requiredParam("host");

    const key = generateAPIKey();
    await client.set(key, host);

    return makeHttpResponse({ key }, 201);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "POST":
        return postCreateAPIKey(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

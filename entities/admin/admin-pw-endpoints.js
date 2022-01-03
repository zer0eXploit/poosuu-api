import requiredParam from "../../helpers/required-param.js";

import { client } from "../../config/redis.js";
import {
  makeHttpResponse,
  makeErrorHttpResponse,
} from "../../helpers/http-response.js";
import { sendPasswordResetEmail } from "../../helpers/email/index.js";
import {
  hashPassword,
  generateHashFrom,
  pwCorrect,
  checkAuthorization,
} from "../../helpers/auth.js";

export const makeAdminPasswordResetEnpointsHandler = (adminList) => {
  const postPasswordReset = async (httpRequest) => {
    const {
      body: { email = requiredParam("email") },
    } = httpRequest;

    const admin = await adminList.getAdminByEmail(email);

    if (admin) {
      const requestedB4 = await client.get(`pw:${admin._id.toString()}`);

      if (requestedB4) {
        //   how much time has passed since the last email was sent
        let tryAfter = 600000 - (Date.now() - parseInt(requestedB4));

        if (tryAfter < 0) tryAfter = 1;

        return makeHttpResponse(
          {
            message:
              "You have requested password reset email recently. Please try again later.",
            retryAfter: tryAfter,
          },
          429,
          { "Content-Type": "application/json", "Retry-After": tryAfter }
        );
      }

      const hash = generateHashFrom(admin._id.toString());
      const url = `${process.env.FRONT_END_DOMAIN}/password-reset/${hash}`;

      // Save the token to Redis Temporarily
      await Promise.all([
        client.set(hash, admin._id.toString(), {
          EX: 1800,
        }),
        client.set(`pw:${admin._id.toString()}`, Date.now(), {
          EX: 600,
        }),
      ]);

      await sendPasswordResetEmail(admin.name, admin.email, url);
    }
    return makeHttpResponse(
      { message: "Password reset email will be sent if that email exists." },
      200
    );
  };

  const putPassword = async (httpRequest) => {
    const {
      params: { token },
    } = httpRequest;

    if (token) {
      const {
        body: { newPassword = requiredParam("newPassword") },
      } = httpRequest;

      const adminId = await client.get(token);

      if (!adminId)
        return makeHttpResponse(
          { message: "Invalid or expired password reset token." },
          401
        );

      await adminList.updateAdminPassword(adminId, hashPassword(newPassword));
      //   remove token from redis
      await client.del(token);

      return makeHttpResponse({ message: "Password reset successful." }, 200);
    }

    // for PUT /password
    const decodedToken = checkAuthorization(httpRequest.headers);

    const {
      body: {
        oldPassword = requiredParam("oldPassword"),
        newPassword = requiredParam("newPassword"),
      },
    } = httpRequest;

    const foundAdmin = await adminList.getAdminByIdWithPw(decodedToken.adminId);

    if (pwCorrect(oldPassword, foundAdmin.password)) {
      await adminList.updateAdminPassword(
        decodedToken.adminId,
        hashPassword(newPassword)
      );

      return makeHttpResponse({ message: "Password updated." }, 200);
    }

    return makeHttpResponse({ message: "Incorrect old password." }, 403);
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "POST":
        return postPasswordReset(httpRequest);

      case "PUT":
        return putPassword(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

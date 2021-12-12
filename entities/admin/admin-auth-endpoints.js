import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import requiredParam from "../../helpers/required-param.js";
import { isValidEmail } from "../../helpers/validation.js";
import { makeHttpResponse } from "../../helpers/http-response.js";

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

    if (bcrypt.compareSync(password, admin.password)) {
      const jwtSecret = process.env.JWT_SECRET;
      const expiresIn = process.env.JWT_EXPIRES || "2h";
      const options = { expiresIn };
      const token = jwt.sign({ adminId: admin._id }, jwtSecret, options);
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

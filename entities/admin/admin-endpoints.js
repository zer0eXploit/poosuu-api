import makeAdmin from "./admin.js";

import { ResourceNotFoundError } from "../../helpers/errors.js";
import { makeHttpResponse } from "../../helpers/http-response.js";
import { sendAccountCreationEmail } from "../../helpers/email/index.js";

const makeAdminEndpointsHandler = (adminList) => {
  const getAdmin = async (httpRequest) => {
    const {
      params: { id },
    } = httpRequest;
    const admin = await adminList.getAdminById(id);
    if (!admin) throw new ResourceNotFoundError();
    return makeHttpResponse(admin);
  };

  const createAdmin = async (httpRequest) => {
    const { body } = httpRequest;
    const validAdmin = makeAdmin(body);
    const { _id, name, username, email } = await adminList.createAdmin(
      validAdmin
    );

    await sendAccountCreationEmail(name, email);

    return makeHttpResponse({ _id, name, username, email }, 201);
  };

  const updateAdminInfo = async (httpRequest) => {
    // Only updates name and avatar image
    const {
      body: { name, avatarUrl },
      params: { id },
    } = httpRequest;
    const updated = await adminList.updateAdmin(id, { name, avatarUrl });
    if (!updated) throw new ResourceNotFoundError();
    return makeHttpResponse({
      _id: updated._id,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
    });
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "GET":
        return getAdmin(httpRequest);

      case "PUT":
        return updateAdminInfo(httpRequest);

      case "POST":
        return createAdmin(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeAdminEndpointsHandler;

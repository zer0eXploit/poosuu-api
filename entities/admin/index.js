import AdminModel from "../../models/admin.js";

import makeAdminList from "./admin-list.js";
import makeAdminsEndpointHandler from "./admin-endpoints.js";
import {
  makeAdminLoginEndpointHandler,
  makeAdminAPIKeyEndpointHandler,
} from "./admin-auth-endpoints.js";

const adminList = makeAdminList({ AdminModel });
const adminsEndpointHandler = makeAdminsEndpointHandler(adminList);
export const adminLoginEndpointHandler =
  makeAdminLoginEndpointHandler(adminList);
export const adminAPIKeyEndpointHandler = makeAdminAPIKeyEndpointHandler();

export default adminsEndpointHandler;

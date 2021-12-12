import AdminModel from "../../models/admin.js";

import makeAdminList from "./admin-list.js";
import { makeAdminLoginEndpointHandler } from "./admin-auth-endpoints.js";
import makeAdminsEndpointHandler from "./admin-endpoints.js";

const adminList = makeAdminList({ AdminModel });
const adminsEndpointHandler = makeAdminsEndpointHandler(adminList);
export const adminLoginEndpointHandler =
  makeAdminLoginEndpointHandler(adminList);

export default adminsEndpointHandler;

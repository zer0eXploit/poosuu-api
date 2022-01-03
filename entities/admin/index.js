import AdminModel from "../../models/admin.js";

import makeAdminList from "./admin-list.js";

import {
  makeAdminLoginEndpointHandler,
  makeAdminAPIKeyEndpointHandler,
} from "./admin-auth-endpoints.js";
import makeAdminsEndpointHandler from "./admin-endpoints.js";
import { makeAdminPasswordResetEnpointsHandler } from "./admin-pw-endpoints.js";

const adminList = makeAdminList({ AdminModel });

const adminsEndpointHandler = makeAdminsEndpointHandler(adminList);

export const adminLoginEndpointHandler =
  makeAdminLoginEndpointHandler(adminList);

export const adminAPIKeyEndpointHandler = makeAdminAPIKeyEndpointHandler();

export const adminPasswordResetEnpointsHandler =
  makeAdminPasswordResetEnpointsHandler(adminList);

export default adminsEndpointHandler;

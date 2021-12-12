import AdminModel from "../../models/admin.js";

import makeAdminList from "./admin-list.js";
import makeAdminsEndpointHandler from "./admin-endpoints.js";

const adminList = makeAdminList({ AdminModel });
const adminsEndpointHandler = makeAdminsEndpointHandler(adminList);

export default adminsEndpointHandler;

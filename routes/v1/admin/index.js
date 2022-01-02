import { Router } from "express";

import handleAdminsEndpoint, {
  handleAdminLoginEndpoint,
  handleAdminAPIKeyEndpoint,
} from "../../../controllers/admin.js";

const router = Router();

router.route("/api-keys").all(handleAdminAPIKeyEndpoint);
router.route("/api-keys/:apiKey").all(handleAdminAPIKeyEndpoint);
router.route("/login").post(handleAdminLoginEndpoint);
router.route("/:id").all(handleAdminsEndpoint);
router.route("/").post(handleAdminsEndpoint);

export default router;

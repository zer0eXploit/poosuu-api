import { Router } from "express";

import handleAdminsEndpoint, {
  handleAdminLoginEndpoint,
  handleAdminAPIKeyEndpoint,
} from "../../../controllers/admin.js";

const router = Router();

router.route("/api-key").post(handleAdminAPIKeyEndpoint);
router.route("/login").post(handleAdminLoginEndpoint);
router.route("/:id").all(handleAdminsEndpoint);
router.route("/").post(handleAdminsEndpoint);

export default router;

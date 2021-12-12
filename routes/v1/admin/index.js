import { Router } from "express";

import handleAdminsEndpoint, {
  handleAdminLoginEndpoint,
} from "../../../controllers/admin.js";

const router = Router();

router.route("/login").post(handleAdminLoginEndpoint);
router.route("/:id").all(handleAdminsEndpoint);
router.route("/").post(handleAdminsEndpoint);

export default router;

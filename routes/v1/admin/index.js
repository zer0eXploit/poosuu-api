import { Router } from "express";

import handleAdminsEndpoint from "../../../controllers/admin.js";

const router = Router();

router.route("/:id").all(handleAdminsEndpoint);
router.route("/").post(handleAdminsEndpoint);

export default router;

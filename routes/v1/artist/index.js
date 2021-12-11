import { Router } from "express";

import handleArtistsEndpoint from "../../../controllers/artist.js";

const router = Router();

router.route("/:id").all(handleArtistsEndpoint);
router.route("/").get(handleArtistsEndpoint).post(handleArtistsEndpoint);

export default router;

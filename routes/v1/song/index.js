import { Router } from "express";

import handleSongEndpoint from "../../../controllers/song.js";

const router = Router();

router.route("/:id").all(handleSongEndpoint);
router.route("/").get(handleSongEndpoint).post(handleSongEndpoint);

export default router;

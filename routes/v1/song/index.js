import { Router } from "express";

import handleSongEndpoint, {
  handleSpotifySongsEndpoint,
} from "../../../controllers/song.js";

const router = Router();

router.route("/search/spotify").get(handleSpotifySongsEndpoint);

router.route("/:id").all(handleSongEndpoint);
router.route("/").get(handleSongEndpoint).post(handleSongEndpoint);

export default router;

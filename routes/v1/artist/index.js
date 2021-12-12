import { Router } from "express";

import handleArtistsEndpoint, {
  handleArtistSongsEndpoint,
} from "../../../controllers/artist.js";

const router = Router({ mergeParams: true });

router.route("/:id").all(handleArtistsEndpoint);
router.route("/:id/songs").all(handleArtistSongsEndpoint);
router.route("/").get(handleArtistsEndpoint).post(handleArtistsEndpoint);

export default router;

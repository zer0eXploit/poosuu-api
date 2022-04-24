import { Router } from "express";

import handleArtistsEndpoint, {
  handleArtistCoverEndpoint,
  handleArtistSongsEndpoint,
  handleSpotifyArtistsEndpoint,
} from "../../../controllers/artist.js";

const router = Router({ mergeParams: true });

router.route("/cover").all(handleArtistCoverEndpoint);
router.route("/spotify").get(handleSpotifyArtistsEndpoint);

router.route("/:id").all(handleArtistsEndpoint);
router.route("/:id/songs").all(handleArtistSongsEndpoint);
router.route("/").get(handleArtistsEndpoint).post(handleArtistsEndpoint);

export default router;

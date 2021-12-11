import { Router } from "express";

import handleLyricsEndpoint from "../../../controllers/lyrics.js";

const router = Router();

router.route("/").post(handleLyricsEndpoint);
router
  .route("/:id")
  .get(handleLyricsEndpoint)
  .put(handleLyricsEndpoint)
  .delete(handleLyricsEndpoint);

export default router;

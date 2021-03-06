import { Router } from "express";

import songRoutes from "./song/index.js";
import adminRoutes from "./admin/index.js";
import artistRoutes from "./artist/index.js";
import lyricsRoutes from "./lyrics/index.js";

const router = Router({ mergeParams: true });

router.use("/songs", songRoutes);
router.use("/lyrics", lyricsRoutes);
router.use("/artists", artistRoutes);
router.use("/admins", adminRoutes);

export default router;

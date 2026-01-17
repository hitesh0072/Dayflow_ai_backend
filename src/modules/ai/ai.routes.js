import express from "express";
import * as aiController from "./ai.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/summarize", aiController.summarize);
router.post("/prioritize", aiController.prioritize);
router.post("/estimate", aiController.estimate);
router.post("/prompts", aiController.getPrompts);
router.post("/breakdown", aiController.breakdown);

export default router;

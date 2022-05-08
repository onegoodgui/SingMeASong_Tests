import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";
const testsRouter = Router();

testsRouter.post('/reset', recommendationController.removeAll);
testsRouter.post("", recommendationController.insert);

export default testsRouter


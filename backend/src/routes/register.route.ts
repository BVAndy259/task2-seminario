import { Router } from "express";
import { RegisterController } from "../controllers/register.controller";

const router = Router();

router.post("/", RegisterController.create);

router.get("/games/:gameId", RegisterController.getByGame);

export default router;

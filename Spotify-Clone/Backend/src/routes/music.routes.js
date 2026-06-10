import { Router } from "express";
import { isAuthenticated ,authorizeRoles} from "../middlewares/auth.middleware.js";
import { createMusic, deleteMusic, getAllMusic } from "../controller/music.controller.js";

const router = Router();
router.post("/create", isAuthenticated, authorizeRoles("artist"), createMusic);
router.delete("/delete/:id", isAuthenticated, authorizeRoles("artist"), deleteMusic);
router.get("/all", isAuthenticated, getAllMusic);

export default router 
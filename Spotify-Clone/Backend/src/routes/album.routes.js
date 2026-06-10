import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middleware.js"
import { createAlbum, getAllAlbums } from "../controller/album.controller.js";

const router = Router();

// Public route: Everyone can see albums
router.get("/all", isAuthenticated, getAllAlbums);

// Protected route: Only Artists can create albums
router.post("/create", 
    isAuthenticated, 
    authorizeRoles("artist"), 
    createAlbum
);

export default router;
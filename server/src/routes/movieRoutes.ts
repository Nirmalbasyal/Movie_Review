import { Router } from "express";
import { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } from "../controllers/movie/movieController";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import upload from "../middleware/upload";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", isAuthenticated, isAdmin, upload.single("thumbnail"), createMovie);
router.patch("/:id", isAuthenticated, isAdmin, upload.single("thumbnail"), updateMovie);
router.delete("/:id", isAuthenticated, isAdmin, deleteMovie);

export default router;

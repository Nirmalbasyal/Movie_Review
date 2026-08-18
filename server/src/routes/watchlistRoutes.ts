import express from "express";
import { addToWatchlist, removeFromWatchlist, getMyWatchlist } from "../controllers/watchlist/watchlistController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

// All watchlist routes require login — there's no "public" watchlist
router.get("/", isAuthenticated, getMyWatchlist);
router.post("/:movieId", isAuthenticated, addToWatchlist);
router.delete("/:movieId", isAuthenticated, removeFromWatchlist);

export default router;

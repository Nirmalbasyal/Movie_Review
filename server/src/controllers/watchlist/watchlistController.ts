import { Response } from "express";
import { AuthRequest } from "../../middleware/isAuthenticated";
import Watchlist from "../../models/Watchlist";
import Movie from "../../models/Movie";

// Add a movie to the logged-in user's watchlist
// @route  POST /api/watchlist/:movieId
export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.params;
    const userId = req.user!.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const alreadyExists = await Watchlist.findOne({ user: userId, movie: movieId });
    if (alreadyExists) {
      return res.status(400).json({ message: "Movie is already in your watchlist" });
    }

    const watchlistEntry = await Watchlist.create({ user: userId, movie: movieId });

    res.status(201).json({ message: "Added to watchlist", data: watchlistEntry });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to watchlist", error });
  }
};

// Remove a movie from the logged-in user's watchlist
// @route  DELETE /api/watchlist/:movieId
export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.params;
    const userId = req.user!.id;

    const deleted = await Watchlist.findOneAndDelete({ user: userId, movie: movieId });

    if (!deleted) {
      return res.status(404).json({ message: "Movie is not in your watchlist" });
    }

    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from watchlist", error });
  }
};

// Get the logged-in user's full watchlist (with movie details populated)
// @route  GET /api/watchlist
export const getMyWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const watchlist = await Watchlist.find({ user: userId }).populate("movie").sort({ createdAt: -1 }); // most recently added first

    res.status(200).json({ data: watchlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch watchlist", error });
  }
};

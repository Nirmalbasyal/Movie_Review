import { Response } from "express";
import Review from "../../models/Review";
import Movie from "../../models/Movie";
import { AuthRequest } from "../../middleware/isAuthenticated";

// User: submit a review for a movie
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, rating, comment } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // prevent duplicate review from same user on same movie
    const existingReview = await Review.findOne({ movie: movieId, user: req.user!.id });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this movie" });
    }

    const review = await Review.create({
      movie: movieId,
      user: req.user!.id,
      rating,
      comment,
    });

    const populatedReview = await review.populate("user", "userName");

    res.status(201).json({ message: "Review submitted successfully", data: populatedReview });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review", error });
  }
};

// User: delete their own review
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user!.id) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error });
  }
};

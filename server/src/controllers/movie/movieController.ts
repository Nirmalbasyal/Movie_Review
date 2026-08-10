import { Request, Response } from "express";
import Movie from "../../models/Movie";
import Review from "../../models/Review";
import cloudinary from "../../config/cloudinary";
import { AuthRequest } from "../../middleware/isAuthenticated";

// Admin: create movie
export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, genre } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "movie-review-app" }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      });
      stream.end(req.file!.buffer);
    });

    const movie = await Movie.create({
      name,
      description,
      genre,
      thumbnail: uploadResult.secure_url,
      createdBy: req.user!.id,
    });

    res.status(201).json({ message: "Movie added successfully", data: movie });
  } catch (error) {
    res.status(500).json({ message: "Failed to add movie", error });
  }
};

// Public: get all movies (with average rating)
export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    // attach average rating to each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movie: movie._id });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return {
          ...movie.toObject(),
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        };
      }),
    );

    res.status(200).json({ data: moviesWithRatings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies", error });
  }
};

// Public: get single movie + its reviews
export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviews = await Review.find({ movie: movie._id }).populate("user", "userName");

    res.status(200).json({ data: { movie, reviews } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie", error });
  }
};


// Admin: update movie (thumbnail optional — only re-uploads if a new file is sent)
export const updateMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, genre } = req.body;

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (name) movie.name = name;
    if (description) movie.description = description;
    if (genre) movie.genre = genre;

    // only touch Cloudinary if a new file was actually uploaded
    if (req.file) {
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "movie-review-app" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      movie.thumbnail = uploadResult.secure_url;
    }

    await movie.save();

    res.status(200).json({ message: "Movie updated successfully", data: movie });
  } catch (error) {
    res.status(500).json({ message: "Failed to update movie", error });
  }
};

// Admin: delete movie
export const deleteMovie = async (req: AuthRequest, res: Response) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    await Review.deleteMany({ movie: movie._id }); // clean up its reviews too
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete movie", error });
  }
};

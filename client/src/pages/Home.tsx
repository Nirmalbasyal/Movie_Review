import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../http/api";
import type { Movie } from "../types";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        setMovies(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p className="mx-auto max-w-5xl px-6 py-24 text-text-muted">Loading movies...</p>;
  }

  if (error) {
    return <p className="mx-auto max-w-5xl px-6 py-24 text-error">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-text">Movies</h1>
      <p className="mt-2 text-text-muted">Browse and review your favorite films</p>

      {movies.length === 0 ? (
        <p className="mt-8 text-text-muted">No movies added yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-cinered"
            >
              <img src={movie.thumbnail} alt={movie.name} className="h-64 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-text">{movie.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{movie.genre}</p>

                <div className="mt-2 flex items-center gap-1 text-sm">
                  <span className="text-gold">★</span>
                  <span className="text-text">{movie.averageRating > 0 ? movie.averageRating : "No ratings"}</span>
                  {movie.reviewCount > 0 && <span className="text-text-muted">({movie.reviewCount})</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

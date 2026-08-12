import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../http/api";
import type { Movie } from "../types";
import Loader from "../components/Loader";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [genre, setGenre] = useState<string>("All Genres");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        setMovies(res.data.data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load movies",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <Loader label="Loading movies..." />;
  }

  if (error) {
    return <p className="mx-auto max-w-5xl px-6 py-24 text-error">{error}</p>;
  }

  // build the genre dropdown options from whatever genres actually exist
  const genreOptions = ["All Genres", ...new Set(movies.map((m) => m.genre))];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === "All Genres" || movie.genre === genre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-heading">Movies</h1>
          <p className="mt-2 text-text-muted">Browse and review your favorite films</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-xl border border-border bg-input px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-xl border border-border bg-input px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
          >
            {genreOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <p className="mt-8 text-text-muted">
          {movies.length === 0 ? "No movies added yet." : "No movies match your search."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {filteredMovies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary hover:bg-card-hover"
            >
              <img src={movie.thumbnail} alt={movie.name} className="h-64 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-heading">{movie.name}</h3>
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

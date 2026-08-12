import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../http/api";
import type { Movie } from "../types";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");

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

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await API.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete movie",
      );
    }
  };

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  const totalReviews = movies.reduce((sum, m) => sum + m.reviewCount, 0);
  

  const filteredMovies = movies.filter((movie) => movie.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Admin Dashboard</h1>
          <p className="mt-1 text-text-muted">Manage your movie catalog</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-xl border border-border bg-input px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          />
          <Link
            to="/add-movie"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            + Add Movie
          </Link>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-text-muted">Total Movies</p>
          <p className="mt-1 text-3xl font-bold text-heading">{movies.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-text-muted">Total Reviews</p>
          <p className="mt-1 text-3xl font-bold text-heading">{totalReviews}</p>
        </div>
      </div>

      {/* Movies table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="px-5 py-3 font-medium">Movie</th>
              <th className="px-5 py-3 font-medium">Genre</th>
              <th className="px-5 py-3 font-medium">Rating</th>
              <th className="px-5 py-3 font-medium">Reviews</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                  {movies.length === 0 ? "No movies yet. Add your first one." : "No movies match your search."}
                </td>
              </tr>
            ) : (
              filteredMovies.map((movie) => (
                <tr key={movie._id} className="border-b border-border last:border-0 hover:bg-card-hover">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <img src={movie.thumbnail} alt={movie.name} className="h-12 w-9 rounded object-cover" />
                    <Link to={`/movies/${movie._id}`} className="font-medium text-heading hover:text-link">
                      {movie.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{movie.genre}</td>
                  <td className="px-5 py-3">
                    {movie.averageRating > 0 ? (
                      <span className="text-gold">★ {movie.averageRating}</span>
                    ) : (
                      <span className="text-text-dim">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-text-muted">{movie.reviewCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/edit-movie/${movie._id}`}
                        state={{ from: "admin" }}
                        className="text-link hover:text-link-hover"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(movie._id, movie.name)}
                        className="text-error hover:text-error-hover"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

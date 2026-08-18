import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWatchlist, removeFromWatchlistAsync } from "../store/watchlistSlice";
import Loader from "../components/Loader";

export default function Watchlist() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  if (status === "loading" && items.length === 0) {
    return <Loader label="Loading your watchlist..." />;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-heading">My Watchlist</h1>
      <p className="mt-2 text-text-muted">Movies you've saved to watch later</p>

      {items.length === 0 ? (
        <p className="mt-8 text-text-muted">
          Your watchlist is empty.{" "}
          <Link to="/" className="text-link hover:text-link-hover">
            Browse movies
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {items.map((movie) => (
            <div key={movie._id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <Link to={`/movies/${movie._id}`}>
                <img src={movie.thumbnail} alt={movie.name} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-heading">{movie.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{movie.genre}</p>
                </div>
              </Link>
              <button
                onClick={() => dispatch(removeFromWatchlistAsync(movie._id))}
                className="w-full border-t border-border py-2 text-sm text-error hover:bg-error hover:text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

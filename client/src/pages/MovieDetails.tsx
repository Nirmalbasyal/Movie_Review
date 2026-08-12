import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../http/api";
import type { Movie, Review } from "../types";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // review editing state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data.data.movie);
        setReviews(res.data.data.reviews);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load movie",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const refetchMovie = async () => {
    const res = await API.get(`/movies/${id}`);
    setMovie(res.data.data.movie);
    setReviews(res.data.data.reviews);
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      await API.post("/reviews", { movieId: id, rating, comment });
      setComment("");
      setRating(5);
      await refetchMovie();
    } catch (err: unknown) {
      setSubmitError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this movie? This cannot be undone.");
    if (!confirmed) return;

    try {
      await API.delete(`/movies/${id}`);
      navigate("/");
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete movie",
      );
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
  };

  const handleUpdateReview = async (e: FormEvent, reviewId: string) => {
    e.preventDefault();
    try {
      await API.patch(`/reviews/${reviewId}`, { rating: editRating, comment: editComment });
      setEditingReviewId(null);
      await refetchMovie();
    } catch (err: unknown) {
      setSubmitError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update review",
      );
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm("Delete your review?");
    if (!confirmed) return;

    try {
      await API.delete(`/reviews/${reviewId}`);
      await refetchMovie();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete review",
      );
    }
  };

  if (loading) {
return <Loader label="Loading movie..." />;
  }

  if (error || !movie) {
    return <p className="mx-auto max-w-4xl px-6 py-24 text-error">{error || "Movie not found"}</p>;
  }

  const alreadyReviewed = reviews.some((r) => r.user._id === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-8 sm:grid-cols-3">
        <img src={movie.thumbnail} alt={movie.name} className="rounded-2xl sm:col-span-1" />

        <div className="sm:col-span-2">
          <h1 className="text-3xl font-bold text-heading">{movie.name}</h1>
          <p className="mt-1 font-medium text-text-muted">{movie.genre}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-gold">★</span>
            <span className="font-semibold text-heading">
              {movie.averageRating > 0 ? movie.averageRating : "No ratings yet"}
            </span>
            <span className="text-text-muted">({movie.reviewCount} reviews)</span>
          </div>

          <p className="mt-4 leading-7 text-text">{movie.description}</p>

          {user?.role === "admin" && (
            <div className="mt-4 flex gap-3">
              <Link
                to={`/edit-movie/${movie._id}`}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-card"
              >
                Edit Movie
              </Link>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error-hover"
              >
                Delete Movie
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review form */}
      {/* Review form */}
      <div className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-heading">Write a Review</h2>

        {!user ? (
          <p className="mt-3 text-text-muted">
            <Link to="/login" className="text-link hover:text-link-hover">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        ) : user.role === "admin" ? (
          <p className="mt-3 text-text-muted">Admins cannot submit reviews.</p>
        ) : alreadyReviewed ? (
          <p className="mt-3 text-text-muted">You've already reviewed this movie.</p>
        ) : (
          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            {submitError && <p className="text-sm text-error">{submitError}</p>}

            <div>
              <label className="text-sm font-medium text-text-muted">Rating</label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? "text-gold" : "text-text-disabled"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Share your thoughts on this movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-border bg-input px-4 py-2 text-text placeholder:text-text-dim"
            />

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews list */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-heading">Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-text-muted">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => {
            const isOwner = review.user._id === user?.id;
            const isEditing = editingReviewId === review._id;

            return (
              <div key={review._id} className="rounded-xl border border-border bg-card p-4">
                {isEditing ? (
                  <form onSubmit={(e) => handleUpdateReview(e, review._id)} className="space-y-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className={`text-2xl ${star <= editRating ? "text-gold" : "text-text-disabled"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-xl border border-border bg-input px-4 py-2 text-text"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-hover"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingReview}
                        className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-text hover:bg-surface"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-heading">{review.user.userName}</span>
                      <span className="text-gold">{"★".repeat(review.rating)}</span>
                    </div>
                    <p className="mt-2 text-text">{review.comment}</p>

                    {isOwner && (
                      <div className="mt-3 flex gap-3 text-sm">
                        <button onClick={() => startEditingReview(review)} className="text-link hover:text-link-hover">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-error hover:text-error-hover"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

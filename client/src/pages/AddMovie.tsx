import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../http/api";

export default function AddMovie() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const navigate = useNavigate();

  // if editing, load the existing movie's data first
  useEffect(() => {
    if (!isEditMode) return;

    const fetchMovie = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        const movie = res.data.data.movie;
        setName(movie.name);
        setDescription(movie.description);
        setGenre(movie.genre);
        setPreview(movie.thumbnail);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, isEditMode]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isEditMode && !thumbnail) {
      setError("Please select a thumbnail image");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("genre", genre);
      if (thumbnail) formData.append("thumbnail", thumbnail); // only send if a new file was picked

      if (isEditMode) {
        await API.patch(`/movies/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Movie updated successfully");
      } else {
        await API.post("/movies", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Movie added successfully");
      }

      setTimeout(() => navigate(isEditMode ? `/movies/${id}` : "/"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save movie");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-lg px-6 py-24 text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-3xl font-bold text-heading">{isEditMode ? "Edit Movie" : "Add Movie"}</h1>
      <p className="mt-1 text-text-muted">Admin only</p>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {success && <p className="mt-4 text-sm text-success">{success}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-text-muted">Movie Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-2 text-text focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-muted">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Action, Sci-Fi"
            required
            className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-2 text-text focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-muted">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-2 text-text focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-muted">
            Thumbnail {isEditMode && "(leave empty to keep current)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-hover"
          />
          {preview && <img src={preview} alt="Preview" className="mt-3 h-40 w-full rounded-xl object-cover" />}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Movie"}
        </button>
      </form>
    </div>
  );
}

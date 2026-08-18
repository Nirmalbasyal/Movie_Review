import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import AddMovie from "./pages/AddMovie";
import AdminDashboard from "./pages/AdminDashboard";
import Watchlist from "./pages/Watchlist";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route
          path="/add-movie"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-movie/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

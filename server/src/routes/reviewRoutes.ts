import { Router } from "express";
import { createReview, updateReview, deleteReview } from "../controllers/review/reviewController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

router.post("/", isAuthenticated, createReview);
router.patch("/:id", isAuthenticated, updateReview);
router.delete("/:id", isAuthenticated, deleteReview);

export default router;

import { Router } from "express";
import { createReview, deleteReview } from "../controllers/review/reviewController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

router.post("/", isAuthenticated, createReview);
router.delete("/:id", isAuthenticated, deleteReview);

export default router;

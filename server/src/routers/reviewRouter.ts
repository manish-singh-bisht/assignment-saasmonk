import express from "express";
import { checkSchema } from "express-validator";
import {
  createReview,
  deleteReview,
  getAllReviewByMovieName,
  updateReview,
} from "../controllers/reviewController.js";
import {
  createReviewSchema,
  deleteReviewSchema,
  getAllReviewByMovieNameSchema,
  updateReviewSchema,
} from "../utils/validations.js";

const router = express.Router();

router.get(
  "/:movieName/reviews",
  checkSchema(getAllReviewByMovieNameSchema),
  getAllReviewByMovieName as any
); // typescript throws error if not done this way (as any),would have solved if more time.;
router.post(
  "/:movieId/reviews",
  checkSchema(createReviewSchema),
  createReview as any
);
router.put(
  "/:movieId/reviews/:id",
  checkSchema(updateReviewSchema),
  updateReview as any
);
router.delete(
  "/reviews/:id",
  checkSchema(deleteReviewSchema),
  deleteReview as any
);

export default router;

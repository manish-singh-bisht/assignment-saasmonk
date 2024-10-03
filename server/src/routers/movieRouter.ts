import express from "express";
import { checkSchema } from "express-validator";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../controllers/movieController.js";
import {
  createMovieSchema,
  deleteMovieSchema,
  getAllMoviesSchema,
  updateMovieSchema,
} from "../utils/validations.js";

const router = express.Router();

router.get("/movies", checkSchema(getAllMoviesSchema), getAllMovies as any);
router.post("/movies", checkSchema(createMovieSchema), createMovie as any);
router.put(
  "/movies/:movieId",
  checkSchema(updateMovieSchema),
  updateMovie as any
);
router.delete(
  "/movies/:movieId",
  checkSchema(deleteMovieSchema),
  deleteMovie as any
);

export default router;

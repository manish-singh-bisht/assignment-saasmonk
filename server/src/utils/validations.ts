import { Schema, matchedData, validationResult } from "express-validator";
import { Request, Response } from "express";

export const validateRequest = (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return false; // Validation failed
  }

  return matchedData(req); // Return matched data if validation succeeds
};

// Common schema for pagination
export const paginationSchema: Schema = {
  page: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Page must be a positive integer",
    },
    toInt: true,
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Limit must be a positive integer",
    },
    toInt: true,
  },
};

// Common schema for movieId
export const movieIdSchema: Schema = {
  movieId: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Movie id is required",
    },
    isUUID: {
      errorMessage: "Invalid movie id",
    },
  },
};

export const getAllMoviesSchema: Schema = paginationSchema;

export const createMovieSchema: Schema = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Movie name is required",
    },
    isString: {
      errorMessage: "Movie name must be a string",
    },
    trim: true,
  },
  releaseDate: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Release date is required",
    },
  },
};
export const updateMovieSchema: Schema = {
  ...movieIdSchema,
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Movie name is required",
    },
    isString: {
      errorMessage: "Movie name must be a string",
    },
    trim: true,
  },
  releaseDate: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Release date is required",
    },
  },
};

export const deleteMovieSchema: Schema = movieIdSchema;

export const getAllReviewByMovieNameSchema: Schema = {
  movieName: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Movie name is required",
    },
    isString: {
      errorMessage: "Movie name must be a string",
    },
    trim: true,
  },
  ...paginationSchema,
};

export const createReviewSchema: Schema = {
  ...movieIdSchema,

  review: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Review text is required",
    },
    isString: {
      errorMessage: "Review must be a string",
    },
    trim: true,
  },
  reviewer: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Reviewer must be a string",
    },
    trim: true,
  },
  rating: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Rating is required",
    },
    isInt: {
      options: { min: 0, max: 10 },
      errorMessage: "Rating must be an integer between 0 and 10",
    },
    toInt: true,
  },
};
export const updateReviewSchema: Schema = {
  ...movieIdSchema,
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Review id is required",
    },
    isUUID: {
      errorMessage: "Provide correct movie id",
    },
  },

  review: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Review text is required",
    },
    isString: {
      errorMessage: "Review must be a string",
    },
    trim: true,
  },
  reviewer: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Reviewer must be a string",
    },
    trim: true,
  },
  rating: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Rating is required",
    },
    isInt: {
      options: { min: 0, max: 10 },
      errorMessage: "Rating must be an integer between 0 and 10",
    },
    toInt: true,
  },
};
export const deleteReviewSchema: Schema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Review id is required",
    },
    isUUID: {
      errorMessage: "Provide correct movie id",
    },
  },
};

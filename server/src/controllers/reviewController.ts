import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { updateMovieRating } from "./movieController.js";
import { validateRequest } from "../utils/validations.js";

export const getAllReviewByMovieName = async (req: Request, res: Response) => {
  try {
    const matchedData = validateRequest(req, res);
    if (!matchedData) return;

    const { page = 1, limit = 50, movieName } = matchedData;
    const skip = (page - 1) * limit;

    const isMovieExist = await prisma.movie.findUnique({
      where: { name: movieName },
    });

    if (!isMovieExist) {
      return res.status(404).json({ error: "No such movie" });
    }
    const movie = isMovieExist;
    const [totalReviewsCount, reviews] = await Promise.all([
      prisma.review.count({ where: { movieId: movie.id } }),
      prisma.review.findMany({
        where: { movieId: movie.id },
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(totalReviewsCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      reviews,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
        totalReviewsCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;
  const { reviewer, rating, review, movieId } = matchedData;

  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!isMovieExist) {
      return res.status(404).json({ error: "Movie doesn't exists." });
    }

    const movie = isMovieExist;

    const newReview = await prisma.review.create({
      data: {
        review,
        reviewer,
        rating,
        movieId: movie.id,
      },
    });
    res.status(200).json({ review: newReview });
    await updateMovieRating(movie.id); //for now doing it this way, but in real scenario will do it via background job like a queue or kafka . currently cannot do kafka because upstash have stopped supporting kafka.

    return;
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;
  const { reviewer, rating, review, movieId, id } = matchedData;

  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!isMovieExist) {
      return res.status(404).json({ error: "No such movie" });
    }
    const movie = isMovieExist;
    const isReviewExist = await prisma.review.findUnique({
      where: { id: id, movieId: movie.id },
    });

    if (!isReviewExist) {
      return res.status(404).json({ error: "No such review exists." });
    }

    const updatedReview = await prisma.review.update({
      where: { id: id, movieId: movie.id },
      data: {
        review,
        reviewer,
        rating,
        movieId: movie.id,
      },
    });
    res.status(200).json({ review: updatedReview });
    await updateMovieRating(movie.id); //for now doing it this way, but in real scenario will do it via background job like a queue or kafka . currently cannot do kafka because upstash have stopped supporting kafka.
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteReview = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;
  const { id } = matchedData;

  try {
    const isReviewExist = await prisma.review.findUnique({
      where: { id },
    });

    if (!isReviewExist) {
      return res.status(404).json({ error: "No such review" });
    }

    const review = await prisma.review.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Review deleted successfully",
      review: review.id,
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

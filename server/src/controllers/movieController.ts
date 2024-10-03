import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { validateRequest } from "../utils/validations.js";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const matchedData = validateRequest(req, res);
    if (!matchedData) return;

    const { page = 1, limit = 50 } = matchedData;
    const skip = (page - 1) * limit;

    const [totalMoviesCount, movies] = await Promise.all([
      prisma.movie.count(),
      prisma.movie.findMany({
        skip,
        take: limit,
        orderBy: {
          averageRating: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(totalMoviesCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      movies,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
        totalMoviesCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;

  const { name, releaseDate } = matchedData;

  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { name: name },
    });

    if (isMovieExist) {
      return res.status(404).json({ error: "Movie already exists." });
    }

    const movie = await prisma.movie.create({
      data: {
        name,
        releaseDate: new Date(releaseDate),
      },
    });

    return res.status(200).json({ movie });
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;

  const { movieId, name, releaseDate } = matchedData;

  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!isMovieExist) {
      return res.status(404).json({ error: "No such movie" });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        name,
        releaseDate: new Date(releaseDate),
      },
    });

    return res.status(200).json({ movie: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const matchedData = validateRequest(req, res);
  if (!matchedData) return;
  const { movieId } = matchedData;

  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!isMovieExist) {
      return res.status(404).json({ error: "No such movie" });
    }

    const movie = await prisma.movie.delete({
      where: { id: movieId },
    });

    return res.status(200).json({
      message: "Movie deleted successfully",
      movie: movie.id,
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMovieRating = async (movieId: string) => {
  try {
    const isMovieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!isMovieExist) {
      return { error: "No such movie" };
    }
    const reviews = await prisma.review.findMany({
      where: { movieId },
    });

    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

    await prisma.movie.update({
      where: { id: movieId },
      data: { averageRating: avgRating },
    });
  } catch (error) {
    console.error("Error updating movie review:", error);
    return { error: "Error updating movie review" };
  }
};

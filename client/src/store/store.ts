import { create } from "zustand";
import { MovieType, ReviewType } from "../lib/types";

interface MoviesStore {
  movies: MovieType[];
  setMovies: (movies: MovieType[]) => void;
  setMovie: (movie: MovieType) => void;
  updateMovie: (updatedMovie: MovieType) => void;
  removeMovie: (id: string) => void;
  getMovie: (id: string) => MovieType | undefined;
}

interface ReviewsStore {
  reviews: ReviewType[];
  setReviews: (reviews: ReviewType[]) => void;
  setReview: (review: ReviewType) => void;
  updateReview: (updatedReview: ReviewType) => void;
  removeReview: (id: string) => void;
  getReview: (id: string) => ReviewType | undefined;
}

export const useMoviesStore = create<MoviesStore>((set, get) => ({
  movies: [],

  setMovies: (movies: MovieType[]) => set({ movies }),

  setMovie: (movie: MovieType) =>
    set((state) => ({ movies: [...state.movies, movie] })),

  updateMovie: (updatedMovie: MovieType) =>
    set((state) => ({
      movies: state.movies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      ),
    })),

  removeMovie: (id: string) =>
    set((state) => ({
      movies: state.movies.filter((movie) => movie.id !== id),
    })),

  getMovie: (id: string) => get().movies.find((movie) => movie.id === id),
}));

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
  reviews: [],

  setReviews: (reviews: ReviewType[]) => set({ reviews }),

  setReview: (review: ReviewType) =>
    set((state) => ({ reviews: [...state.reviews, review] })),

  updateReview: (updatedReview: ReviewType) =>
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      ),
    })),

  removeReview: (id: string) =>
    set((state) => ({
      reviews: state.reviews.filter((review) => review.id !== id),
    })),

  getReview: (id: string) => get().reviews.find((review) => review.id === id),
}));

import axios from "axios";
import { API_BASE_URL } from "../../config/index";

export const reviewCreateAction = async ({
  currentReview,
}: {
  currentReview: {
    movieId: string;
    rating: number;
    review: string;
    reviewer: string;
  };
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${currentReview.movieId}/reviews`,
      {
        review: currentReview.review,
        reviewer: currentReview.reviewer,
        rating: currentReview.rating,
        movieId: currentReview.movieId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to add review.");
  }
};

export const reviewEditAction = async ({
  currentReview,
}: {
  currentReview: {
    id: string;
    movieId: string;
    rating: number;
    review: string;
    reviewer: string;
  };
}) => {
  try {
    if (currentReview.id) {
      const response = await axios.put(
        `${API_BASE_URL}/${currentReview.movieId}/reviews/${currentReview.id}`,
        {
          review: currentReview.review,
          reviewer: currentReview.reviewer,
          rating: currentReview.rating,
          movieId: currentReview.movieId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    }
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to edit review.");
  }
};

import axios from "axios"; // Import Axios
import { API_BASE_URL } from "../../config/index";

export const movieCreateAction = async ({
  currentMovie,
}: {
  currentMovie: { id: string | null; name: string; releaseDate: Date | null };
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/movies`, currentMovie, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw new Error("Failed to add movie.");
  }
};

export const movieEditAction = async ({
  currentMovie,
}: {
  currentMovie: { id: string | null; name: string; releaseDate: Date | null };
}) => {
  try {
    if (currentMovie.id !== null) {
      const response = await axios.put(
        `${API_BASE_URL}/movies/${currentMovie.id}`,
        {
          name: currentMovie.name,
          releaseDate: currentMovie.releaseDate,
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
    console.error("Error editing movie:", error);
    throw new Error("Failed to edit movie.");
  }
};

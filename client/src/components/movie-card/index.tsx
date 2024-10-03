import { Suspense, lazy, useState } from "react";
import { Button } from "../ui/button";
import { ModalType, MovieType } from "@/lib/types";
import { API_BASE_URL } from "@/config";
import axios from "axios";
import { useMoviesStore } from "@/store/store";
import { Loader, PenSquare, Trash2 } from "lucide-react";

const MovieModal = lazy(() => import("../movie-modal"));

interface MovieCardProps {
  title: string;
  releaseDate: string;
  averageRating: number;
  movieId: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  releaseDate,
  averageRating,
  movieId,
}) => {
  const getMovie = useMoviesStore((state) => state.getMovie);
  const removeMovie = useMoviesStore((state) => state.removeMovie);
  const [modalState, setModalState] = useState<{
    type: ModalType;
    isOpen: boolean;
    currentMovie: MovieType | null;
  }>({ type: null, isOpen: false, currentMovie: null });

  const [error, setError] = useState<string | null>(null);
  const handleOpenModal = (type: ModalType, currentMovie: MovieType) => {
    setModalState({ type, isOpen: true, currentMovie });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, isOpen: false, currentMovie: null });
  };
  const deleteHanlder = async (e, id: string) => {
    e.preventDefault();
    try {
      removeMovie(id);
      const response = await axios.delete(`${API_BASE_URL}/movies/${id}`);
    } catch (err) {
      setError("Error fetching reviews. Please try again later.");
    }
  };
  return (
    <div className="border   p-4  bg-primaryGray ">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl ">{title}</h2>
        <p className="italic text-lg">Released: {releaseDate}</p>
        <p className="font-bold text-lg">Rating: {averageRating}/10</p>
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            const currentMovie = getMovie(movieId);
            handleOpenModal("movie", currentMovie as MovieType);
          }}
        >
          <PenSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => deleteHanlder(e, movieId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {modalState.isOpen && modalState.type === "movie" && (
        <Suspense fallback={<Loader />}>
          <MovieModal
            isOpen={modalState.isOpen}
            onOpenChange={handleCloseModal}
            mode={"edit"}
            movie={modalState.currentMovie as MovieType}
          />
        </Suspense>
      )}
    </div>
  );
};

export default MovieCard;

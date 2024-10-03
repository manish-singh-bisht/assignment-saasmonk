import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormMode, ReviewType, MovieType } from "@/lib/types";
import { reviewCreateAction, reviewEditAction } from "./actions";
import { useMoviesStore, useReviewsStore } from "@/store/store";

interface ReviewModalProps {
  review?: ReviewType;
  movieName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onOpenChange,
  mode,
  review,
  movieName,
}) => {
  const movies = useMoviesStore((state) => state.movies);
  const setReview = useReviewsStore((state) => state.setReview);
  const updatReview = useReviewsStore((state) => state.updateReview);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(
    movieName || null
  );
  const [currentReview, setCurrentReview] = useState(
    review || {
      id: null,
      movieId: null,
      rating: 0,
      review: "",
      reviewer: "",
    }
  );

  const currentReviewHandler = (
    item: keyof ReviewType,
    value: string | number | null
  ) => {
    setCurrentReview((prev) => ({ ...prev, [item]: value }));
  };

  const submitHandler = async () => {
    setLoading(true)
    if (mode === "create") {
      if (currentReview.movieId) {
        const data = await reviewCreateAction({
          currentReview: {
            review: currentReview.review,
            reviewer: currentReview.reviewer || "",
            rating: currentReview.rating,
            movieId: currentReview.movieId,
          },
        });
        setReview(data.review);
      }
    } else {
      if (currentReview.movieId && currentReview.id) {
        const data = await reviewEditAction({
          currentReview: {
            id: currentReview.id,
            review: currentReview.review,
            reviewer: currentReview.reviewer || "",
            rating: currentReview.rating,
            movieId: currentReview.movieId,
          },
        });
        updatReview(data.review);
      }
    }
  setLoading(false)
    onOpenChange(false);
  };

  const selectMovieHandler = (selectedMovie: string) => {
    if (mode === "edit") return;
    const selected = movies.find((movie) => movie.name === selectedMovie);
    if (selected) {
      currentReviewHandler("movieId", selected.id);
      setSelectedMovie(selected.name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-[3px] border-primaryGray py-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            {mode === "edit" ? "Edit" : "Add new"} Review
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={selectMovieHandler}
            value={selectedMovie || ""}
          >
            <SelectTrigger className="border-[3px] py-6 border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0">
              <SelectValue placeholder="Select a movie" />
            </SelectTrigger>
            <SelectContent className="rounded-none ">
              {movies.map((movie: MovieType) => (
                <SelectItem key={movie.id} value={movie.name}>
                  {movie.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Your name"
            value={currentReview.reviewer}
            className="border-[3px]  py-6 border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0"
            onChange={(e) => currentReviewHandler("reviewer", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Rating out of 10"
            min="1"
            max="10"
            className="border-[3px] py-6  border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0"
            value={currentReview.rating || ""}
            onChange={(e) =>
              currentReviewHandler("rating", Number(e.target.value))
            }
          />
          <Textarea
            placeholder="Review comments"
            value={currentReview.review}
            onChange={(e) => currentReviewHandler("review", e.target.value)}
            className="border-[3px] py-6 border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0"
          />
          <div className="w-full justify-end flex">
            <Button
              onClick={submitHandler}
              className="w-fit bg-primaryBlue py-6" disabled={loading}
            >
            {loading
                ? "..."
                : `${mode === "edit" ? "Update" : "Create"} Review`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;

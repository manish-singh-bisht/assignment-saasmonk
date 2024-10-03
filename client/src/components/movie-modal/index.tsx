import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormMode, MovieType } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { movieCreateAction, movieEditAction } from "./actions.ts";
import { useMoviesStore } from "@/store/store.ts";

interface MovieModalProps {
  movie?: MovieType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
}

const MovieModal: React.FC<MovieModalProps> = ({
  isOpen,
  onOpenChange,
  mode,
  movie,
}) => {
  const [currentMovie, setCurrentMovie] = useState<{
    id: string | null;
    name: string;
    releaseDate: Date | null;
  }>(movie || { id: null, name: "", releaseDate: null });
  const [loading, setLoading] = useState(false);
  const setMovie = useMoviesStore((state) => state.setMovie);
  const updateMovie = useMoviesStore((state) => state.updateMovie);

  const currentMovieHandler = (item: keyof MovieType, value: string | Date) => {
    setCurrentMovie((prev) => ({ ...prev, [item]: value }));
  };
  const submitHandler = async () => {
    setLoading(true)
    if (mode === "create") {
      if (currentMovie.releaseDate !== null) {
        const data = await movieCreateAction({ currentMovie });
        setMovie(data.movie);
      }
    } else {
      if (currentMovie.releaseDate !== null) {
        const data = await movieEditAction({ currentMovie });
        updateMovie(data.movie);
      }
    }
setLoading(false)
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-none border-[3px] border-primaryGray py-10"
        onClick={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-normal">
            {mode === "edit" ? "Edit" : "Add new"} Movie
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            className="border-[3px] py-6  border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0"
            value={currentMovie.name}
            onChange={(e) => currentMovieHandler("name", e.target.value)}
          />
          <Popover>
            <PopoverTrigger
              asChild
              className="text-left  flex justify-start font-normal "
            >
              <Button
                variant="outline"
                className="border-[3px] py-6  border-primaryGray rounded-none bg-none shadow-none focus:outline-none focus-visible:ring-0 w-full text-left"
              >
                {currentMovie.releaseDate ? (
                  format(new Date(currentMovie.releaseDate), "PPP")
                ) : (
                  <span className="text-left text-gray-500">Release date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  (currentMovie.releaseDate
                    ? (new Date(currentMovie.releaseDate) as Date)
                    : null) as Date
                }
                onSelect={(date) =>
                  currentMovieHandler("releaseDate", date as Date)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full justify-end flex">
          <Button onClick={submitHandler} className="w-fit bg-primaryBlue py-6" disabled={loading}>
          

             {loading
                ? "..."
                : `${mode === "edit" ? "Update" : "Create"} Movie`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;

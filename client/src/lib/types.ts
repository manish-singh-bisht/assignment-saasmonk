export type MovieType = {
  id: string;
  name: string;
  releaseDate: Date;
  averageRating: number;
};
export type ReviewType = {
  id: string;
  movieId: string;
  review: string;
  reviewer?: string;
  rating: number;
};
export type FormMode = "create" | "edit";
export type ModalType = "movie" | "review" | null;

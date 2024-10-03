import React, { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, PenSquare, Trash2 } from "lucide-react";
import { useMoviesStore, useReviewsStore } from "@/store/store";
import { ModalType } from "@/lib/types";
const ReviewModal = lazy(() => import("../review-modal"));

interface ReviewType {
  id: string;
  movieId: string;
  reviewer: string;
  rating: number;
  review: string;
}

const Reviews: React.FC = () => {
  const { movieName } = useParams<{ movieName: string }>();
  const reviews = useReviewsStore((state) => state.reviews);
  const setReviews = useReviewsStore((state) => state.setReviews);
  const getReview = useReviewsStore((state) => state.getReview);
  const removeReview = useReviewsStore((state) => state.removeReview);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const totalRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0)
      : 0;
  const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

  const [modalState, setModalState] = useState<{
    type: ModalType;
    isOpen: boolean;
    currentReview: ReviewType | null;
  }>({ type: null, isOpen: false, currentReview: null });

  const handleOpenModal = (type: ModalType, currentReview: ReviewType) => {
    setModalState({ type, isOpen: true, currentReview });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, isOpen: false, currentReview: null });
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/${movieName}/reviews`
        );
        setReviews(response.data.reviews);
      } catch (err) {
        setError("Error fetching reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const deleteHanlder = async (e, id: string) => {
    e.preventDefault();
    try {
      removeReview(id);
      const response = await axios.delete(`${API_BASE_URL}/reviews/${id}`);
    } catch (err) {
      setError("Error fetching reviews. Please try again later.");
    }
  };
  return (
    <div>
      {reviews.length > 0 ? (
        <div className=" ">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex justify-between mt-5 items-center">
                <span className="text-5xl font-normal">{movieName}</span>
                <span className="text-4xl font-normal text-blue-800">
                  {averageRating}/10
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 rounded-none">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="rounded-none border-[3px] border-primaryGray"
                  >
                    <CardContent className="pt-6 rounded-none">
                      <div className="flex justify-between items-start">
                        <p>{review.review}</p>
                        <span className="text-blue-800 ml-2">
                          {review.rating}/10
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          By {review.reviewer}
                        </span>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const currentReview = getReview(review.id);
                              handleOpenModal(
                                "review",
                                currentReview as ReviewType
                              );
                            }}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => deleteHanlder(e, review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-4xl h-full  w-screen flex font-bold items-center justify-center p-10">
          No reviews yet.
        </div>
      )}{" "}
      {modalState.isOpen && modalState.type === "review" && (
        <Suspense fallback={<Loader />}>
          <ReviewModal
            isOpen={modalState.isOpen}
            onOpenChange={handleCloseModal}
            mode={"edit"}
            review={modalState.currentReview as ReviewType}
            movieName={movieName}
          />{" "}
        </Suspense>
      )}
    </div>
  );
};

export default Reviews;

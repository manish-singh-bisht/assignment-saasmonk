"use client";
import { Suspense, lazy, useState } from "react";
import { Button } from "../ui/button";

import { ModalType } from "@/lib/types";
import { Loader } from "lucide-react";

const MovieModal = lazy(() => import("../movie-modal"));
const ReviewModal = lazy(() => import("../review-modal"));

const Header = () => {
  const [modalState, setModalState] = useState<{
    type: ModalType;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  const handleOpenModal = (type: ModalType) => {
    setModalState({ type, isOpen: true });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, isOpen: false });
  };

  return (
    <div className="flex px-paddingX p-3 justify-between items-center bg-primaryGray">
      <div className="w-full text-xl">MOVIECRITIC</div>
      <div className="flex gap-2">
        <Button
          className="border-slate-400 p-5 border-2 text-primaryBlue bg-white"
          onClick={() => handleOpenModal("movie")}
        >
          Add new movie
        </Button>
        <Button
          className="bg-primaryBlue border-primaryBlue text-white p-5 border-2"
          onClick={() => handleOpenModal("review")}
        >
          Add new review
        </Button>

        {modalState.isOpen && modalState.type === "movie" && (
          <Suspense fallback={<Loader />}>
            {" "}
            <MovieModal
              isOpen={modalState.isOpen}
              onOpenChange={handleCloseModal}
              mode={"create"}
            />
          </Suspense>
        )}

        {modalState.isOpen && modalState.type === "review" && (
          <Suspense fallback={<Loader />}>
            <ReviewModal
              isOpen={modalState.isOpen}
              onOpenChange={handleCloseModal}
              mode={"create"}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MovieType } from "@/lib/types";
import { API_BASE_URL } from "@/config";
import MovieCard from "../movie-card";
import { Link } from "react-router-dom";
import { useMoviesStore } from "@/store/store";

const Dashboard: React.FC = () => {
  const movies = useMoviesStore((state) => state.movies);
  const setMovies = useMoviesStore((state) => state.setMovies);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/movies`);
        setMovies(response.data.movies);
      } catch (err) {
        setError("Error fetching movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filtered movies based on search query
  const filteredMovies = searchQuery
    ? movies.filter((movie) =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : movies;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="">
      <div className="my-10 w-[45%] flex flex-col gap-10">
        <div className=" text-5xl">The best movie reviews site!</div>
        <div className="items-center h-12 p-2 bg-white flex border-2 focus-within:border-primaryBlue">
          <SearchIcon size={20} />
          <Input
            className="border-none bg-none shadow-none focus:outline-none focus-visible:ring-0"
            placeholder="Search for your favourite movie"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {filteredMovies && filteredMovies.length > 0 ? (
          filteredMovies.map((movie: MovieType) => {
            const formattedDate = formatDate(movie.releaseDate);
            return (
              <Link key={movie.id} to={`/${movie.name}/reviews`}>
                <MovieCard
                  title={movie.name}
                  releaseDate={formattedDate}
                  averageRating={Number(movie.averageRating.toFixed(2))}
                  movieId={movie.id}
                />
              </Link>
            );
          })
        ) : (
          <div className="text-4xl h-full  w-screen flex font-bold items-center justify-center p-10">
            No movies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

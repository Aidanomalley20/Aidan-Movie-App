import React, { useEffect, useState } from "react";
import { searchMovies } from "../services/tmdbApi";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import axios from "axios";

const Home = ({ query, setQuery, handleSearch, movies, error }) => {
  const [randomMovies, setRandomMovies] = useState([]);

  // Fetch random movies on component mount
  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: "268ae786b312d7c19a0e297e679b8d24", // Replace with API_KEY if using tmdbApi.js
              sort_by: "popularity.desc",
            },
          }
        );
        setRandomMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching random movies:", error);
      }
    };

    fetchRandomMovies();
  }, []);

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

      {/* Error Message */}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.length > 0
          ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          : randomMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>
    </div>
  );
};

export default Home;

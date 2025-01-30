import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Categories = () => {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          {
            params: { api_key: "268ae786b312d7c19a0e297e679b8d24" }, 
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const fetchMoviesByGenre = async (genreId) => {
    setSelectedGenre(genreId);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: "268ae786b312d7c19a0e297e679b8d24", 
            with_genres: genreId,
          },
        }
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    }
  };

  return (
    <div className="p-6 bg-indigo-900 text-gray-300 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Categories</h1>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => fetchMoviesByGenre(genre.id)}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 ${
              selectedGenre === genre.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="block bg-indigo-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-contain"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">
                {movie.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;

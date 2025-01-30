import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_KEY, BASE_URL } from "../services/tmdbApi";
import AuthContext from "../context/AuthContext";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { token } = React.useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: API_KEY, append_to_response: "credits" },
        });
        setMovie(response.data);

        if (token) {
          const watchlistResponse = await axios.get(
            "http://localhost:5000/watchlist",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const watchlist = watchlistResponse.data;
          setInWatchlist(
            watchlist.some((item) => item.id === response.data.id)
          );
        }
      } catch (error) {
        console.error("Error fetching movie details or watchlist:", error);
      }
    };

    fetchMovieDetails();
  }, [id, token]);

  const handleAddToWatchlist = async () => {
    if (!token) {
      setMessage("You must be logged in to add movies to your watchlist.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/watchlist",
        {
          movieId: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Movie added to watchlist!");
      setInWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setMessage("Failed to add movie to watchlist.");
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      await axios.delete(`http://localhost:5000/watchlist/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Movie removed from watchlist!");
      setInWatchlist(false);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setMessage("Failed to remove movie from watchlist.");
    }
  };

  if (!movie) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const director = movie.credits.crew.find((crew) => crew.job === "Director");
  const actors = movie.credits.cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(", ");
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 p-6 text-white">
      <div className="flex-shrink-0 w-full md:w-1/5">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-lg w-full"
        />
      </div>

      <div className="flex flex-col w-full md:w-2/3">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-lg mb-4">{movie.overview}</p>
        <div className="text-sm space-y-2">
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>
          <p>
            <strong>Runtime:</strong> {movie.runtime} minutes
          </p>
          <p>
            <strong>Genres:</strong> {genres}
          </p>
          <p>
            <strong>Director:</strong> {director?.name || "Unknown"}
          </p>
          <p>
            <strong>Actors:</strong> {actors}
          </p>
        </div>
        <div className="mt-6">
          {inWatchlist ? (
            <>
              <button
                onClick={handleRemoveFromWatchlist}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-4"
              >
                Remove from Watchlist
              </button>
              <p className="text-green-400">This movie is in your watchlist.</p>
            </>
          ) : (
            <button
              onClick={handleAddToWatchlist}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Add to Watchlist
            </button>
          )}
          {message && <p className="mt-4 text-green-400">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

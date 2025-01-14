import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../services/tmdbApi'; 

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: API_KEY },
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-6">{movie.overview}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg"
        />
        <div>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

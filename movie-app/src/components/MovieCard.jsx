import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const placeholderImage = "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="bg-indigo-700 text-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : placeholderImage
          }
          alt={movie.title}
          className="w-full h-96 object-contain"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

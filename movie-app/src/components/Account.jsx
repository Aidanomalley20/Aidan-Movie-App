import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Account = () => {
  const { user, token, logout } = React.useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch("http://localhost:5000/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [token]);

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/watchlist/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      } else {
        console.error("Failed to remove movie from watchlist");
      }
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  return (
    <div className="p-6 bg-indigo-900 text-gray-300 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Account</h1>
      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg mb-2">
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p className="text-lg mb-2">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-lg mb-2">
          <strong>Phone Number:</strong> {user?.phoneNumber}
        </p>
        <p className="text-lg">
          <strong>Username:</strong> {user?.username}
        </p>
        <h2 className="text-2xl font-bold mt-6">Watchlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {watchlist.length > 0 ? (
            watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-indigo-700 rounded-lg overflow-hidden shadow-lg"
              >
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-96 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                  </div>
                </Link>
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                >
                  Remove from Watchlist
                </button>
              </div>
            ))
          ) : (
            <p>Your watchlist is empty.</p>
          )}
        </div>
        <button
          onClick={logout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;

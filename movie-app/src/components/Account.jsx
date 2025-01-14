import React from "react";
import AuthContext from "../context/AuthContext";

const Account = () => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="p-6 bg-indigo-900 text-gray-300 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Account</h1>
      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg">
          <strong>Username:</strong> {user?.username}
        </p>
        <p className="text-lg">
          <strong>Watchlist:</strong>
        </p>
        <ul className="list-disc list-inside">
          {user?.watchlist?.length > 0 ? (
            user.watchlist.map((movie) => (
              <li key={movie.id} className="mt-2">
                {movie.title}
              </li>
            ))
          ) : (
            <p className="mt-2">Your watchlist is empty.</p>
          )}
        </ul>
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

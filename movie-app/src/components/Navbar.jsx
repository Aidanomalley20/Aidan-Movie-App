import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-indigo-800 p-4 text-gray-300 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Home Button */}
          <Link to="/" className="text-lg font-bold hover:text-white">
            Home
          </Link>

          {/* Account Button */}
          <Link to="/account" className="text-lg font-bold hover:text-white">
            Account
          </Link>

          {/* Categories Button */}
          <Link to="/categories" className="text-lg font-bold hover:text-white">
            Categories
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

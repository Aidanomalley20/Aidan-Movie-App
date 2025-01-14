import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { searchMovies } from "./services/tmdbApi";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import MovieDetails from "./components/MovieDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Home from "./components/Home";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const results = await searchMovies(query);
      const filteredResults = results.filter((movie) => movie.poster_path);
      setMovies(filteredResults);

      if (filteredResults.length === 0) {
        setError("No movies found for your search.");
      }
    } catch (err) {
      setError("Something went wrong while searching. Please try again.");
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="bg-indigo-900 text-gray-300 min-h-screen">
          <header className="p-6 bg-indigo-800 text-center">
            <h1 className="text-4xl font-bold text-white">Easy Movie</h1>
          </header>

          <AuthContext.Consumer>
            {({ token }) => token && <Navbar />}
          </AuthContext.Consumer>

          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                    movies={movies}
                    error={error}
                  />
                </ProtectedRoute>
              }
            />

            {/* Protected Movie Details Route */}
            <Route
              path="/movie/:id"
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              }
            />

            {/* Protected Account Page */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;

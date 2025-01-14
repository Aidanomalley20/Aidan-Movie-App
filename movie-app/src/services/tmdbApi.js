import axios from "axios";

// Export API_KEY and BASE_URL
export const API_KEY = "268ae786b312d7c19a0e297e679b8d24";
export const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

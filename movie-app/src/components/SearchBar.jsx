const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="flex justify-center my-6">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-2/3 p-3 border border-indigo-600 rounded-l-lg focus:outline-none bg-indigo-700 text-gray-300 placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

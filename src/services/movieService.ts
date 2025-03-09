
interface SearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: string;
}

export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
}

// API Key for OMDb API (free tier)
const API_KEY = "8342f4b";  // Updated API key from OMDB
const BASE_URL = "https://www.omdbapi.com/";
const LOCAL_CACHE = new Map<string, MovieSearchResult[]>();

// Helper function to filter movie results client-side
const filterMoviesByPartialTitle = (movies: MovieSearchResult[], partialTitle: string): MovieSearchResult[] => {
  const lowerPartial = partialTitle.toLowerCase();
  return movies.filter(movie => movie.Title.toLowerCase().includes(lowerPartial));
};

// This function combines server-side search with client-side filtering
export const searchMovies = async (searchTerm: string): Promise<MovieSearchResult[]> => {
  try {
    // Only search if we have at least 2 characters
    if (searchTerm.length < 2) {
      return [];
    }
    
    // Try to find partial matches in our local cache first
    let results: MovieSearchResult[] = [];
    
    // Check if we have cached results that contain our search term
    LOCAL_CACHE.forEach((movies, cacheKey) => {
      if (searchTerm.length >= 2 && cacheKey.includes(searchTerm.substring(0, 2))) {
        const filteredMovies = filterMoviesByPartialTitle(movies, searchTerm);
        if (filteredMovies.length > 0) {
          results.push(...filteredMovies);
        }
      }
    });
    
    // If we found cached results, return them
    if (results.length > 0) {
      // Remove duplicates (by imdbID)
      const uniqueResults = Array.from(
        new Map(results.map(movie => [movie.imdbID, movie])).values()
      );
      return uniqueResults.slice(0, 10); // Limit to 10 results
    }
    
    // If no cached results or too few, make a server request
    // Use the first few characters to get broader results that we'll filter client-side
    const searchPrefix = searchTerm.substring(0, Math.min(4, searchTerm.length));
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchPrefix)}&type=movie`);
    const data: SearchResponse = await response.json();
    
    if (data.Response === "True") {
      // Cache the results for future use
      LOCAL_CACHE.set(searchPrefix, data.Search);
      
      // Filter the results to match our search term
      return filterMoviesByPartialTitle(data.Search, searchTerm);
    }
    
    // If we're here, the server didn't find anything
    // Try an even shorter prefix as a fallback
    if (searchTerm.length >= 3) {
      const shorterPrefix = searchTerm.substring(0, 3);
      const fallbackResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(shorterPrefix)}&type=movie`);
      const fallbackData: SearchResponse = await fallbackResponse.json();
      
      if (fallbackData.Response === "True") {
        // Cache the results
        LOCAL_CACHE.set(shorterPrefix, fallbackData.Search);
        // Filter the results
        return filterMoviesByPartialTitle(fallbackData.Search, searchTerm);
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const getMovieById = async (imdbId: string): Promise<MovieDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=short`);
    const data = await response.json();
    
    if (data.Response === "True") {
      return {
        Title: data.Title,
        Year: data.Year,
        Poster: data.Poster,
        imdbID: data.imdbID
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

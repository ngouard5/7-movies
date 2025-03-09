
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

export const searchMovies = async (searchTerm: string): Promise<MovieSearchResult[]> => {
  try {
    // Only search if we have at least 2 characters
    if (searchTerm.length < 2) {
      return [];
    }
    
    // First try exact query - This works best for popular movies like "Harry Potter"
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`);
    const data: SearchResponse = await response.json();
    
    if (data.Response === "True") {
      // Cache the results
      LOCAL_CACHE.set(searchTerm, data.Search);
      return data.Search;
    }
    
    // If exact query failed, check our cache for partial matches
    let results: MovieSearchResult[] = [];
    
    LOCAL_CACHE.forEach((movies, cacheKey) => {
      // Check if the cache key contains our search term or vice versa
      if (cacheKey.toLowerCase().includes(searchTerm.toLowerCase()) || 
          searchTerm.toLowerCase().includes(cacheKey.toLowerCase())) {
        const filteredMovies = filterMoviesByPartialTitle(movies, searchTerm);
        if (filteredMovies.length > 0) {
          results.push(...filteredMovies);
        }
      }
    });
    
    if (results.length > 0) {
      // Remove duplicates
      const uniqueResults = Array.from(
        new Map(results.map(movie => [movie.imdbID, movie])).values()
      );
      return uniqueResults.slice(0, 10); // Limit to 10 results
    }
    
    // If nothing found yet, try with a prefix search
    // For example, if searching for "Harry Potter", try just "Harr"
    if (searchTerm.length > 3) {
      const prefix = searchTerm.substring(0, 4);
      const prefixResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(prefix)}&type=movie`);
      const prefixData: SearchResponse = await prefixResponse.json();
      
      if (prefixData.Response === "True") {
        // Cache these results too
        LOCAL_CACHE.set(prefix, prefixData.Search);
        
        // Return filtered results that match our search term
        return filterMoviesByPartialTitle(prefixData.Search, searchTerm);
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

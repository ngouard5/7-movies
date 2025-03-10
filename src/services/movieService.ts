
import { movieTitleTranslations } from "@/data/movieTranslations";

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
  frenchTitle?: string;
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

// Create a reverse mapping from French titles to English titles
const frenchToEnglishTitles = new Map<string, string>();
Object.entries(movieTitleTranslations).forEach(([englishTitle, frenchTitle]) => {
  frenchToEnglishTitles.set(frenchTitle.toLowerCase(), englishTitle);
});

// Helper function to filter movie results client-side
const filterMoviesByPartialTitle = (movies: MovieSearchResult[], partialTitle: string): MovieSearchResult[] => {
  const lowerPartial = partialTitle.toLowerCase();
  return movies.filter(movie => {
    const englishMatches = movie.Title.toLowerCase().includes(lowerPartial);
    // Check if this movie has a French title and if it matches our search term
    const frenchTitle = movieTitleTranslations[movie.Title];
    const frenchMatches = frenchTitle ? frenchTitle.toLowerCase().includes(lowerPartial) : false;
    
    // Add the French title to the movie object if it exists
    if (frenchTitle) {
      movie.frenchTitle = frenchTitle;
    }
    
    return englishMatches || frenchMatches;
  });
};

// Find English title from French search term
const findEnglishTitleFromFrench = (frenchSearchTerm: string): string | null => {
  // Check if the search term is a partial match for any French title
  const lowerSearchTerm = frenchSearchTerm.toLowerCase();
  
  for (const [frenchTitle, englishTitle] of frenchToEnglishTitles.entries()) {
    if (frenchTitle.includes(lowerSearchTerm)) {
      return englishTitle;
    }
  }
  
  return null;
};

export const searchMovies = async (searchTerm: string): Promise<MovieSearchResult[]> => {
  try {
    // Only search if we have at least 2 characters
    if (searchTerm.length < 2) {
      return [];
    }
    
    // First try exact query - This works best for popular movies
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`);
    const data: SearchResponse = await response.json();
    
    let results: MovieSearchResult[] = [];
    
    if (data.Response === "True") {
      // Add French titles to the results
      data.Search.forEach(movie => {
        const frenchTitle = movieTitleTranslations[movie.Title];
        if (frenchTitle) {
          movie.frenchTitle = frenchTitle;
        }
      });
      
      // Cache the results
      LOCAL_CACHE.set(searchTerm, data.Search);
      results = [...data.Search];
    }
    
    // Try searching with the English title if the user might be searching in French
    const potentialEnglishTitle = findEnglishTitleFromFrench(searchTerm);
    if (potentialEnglishTitle) {
      // If we found a potential English title, search for it
      try {
        const englishResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(potentialEnglishTitle)}&type=movie`);
        const englishData: SearchResponse = await englishResponse.json();
        
        if (englishData.Response === "True") {
          // Add French titles to these results too
          englishData.Search.forEach(movie => {
            const frenchTitle = movieTitleTranslations[movie.Title];
            if (frenchTitle) {
              movie.frenchTitle = frenchTitle;
            }
          });
          
          // Add to cache and results
          LOCAL_CACHE.set(potentialEnglishTitle, englishData.Search);
          
          // Combine results, removing duplicates by imdbID
          const allResults = [...results, ...englishData.Search];
          const uniqueResults = Array.from(
            new Map(allResults.map(movie => [movie.imdbID, movie])).values()
          );
          results = uniqueResults;
        }
      } catch (error) {
        console.error("Error with English title search:", error);
      }
    }
    
    // Check our cache for partial matches if we haven't found anything yet
    if (results.length === 0) {
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
    }
    
    // If we have results from any of our search attempts, prepare and return them
    if (results.length > 0) {
      // Filter again to prioritize results that match the search term in either language
      const filteredResults = filterMoviesByPartialTitle(results, searchTerm);
      
      // Remove duplicates
      const uniqueResults = Array.from(
        new Map(filteredResults.map(movie => [movie.imdbID, movie])).values()
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
        // Add French titles
        prefixData.Search.forEach(movie => {
          const frenchTitle = movieTitleTranslations[movie.Title];
          if (frenchTitle) {
            movie.frenchTitle = frenchTitle;
          }
        });
        
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

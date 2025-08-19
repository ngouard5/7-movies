import { movies } from "@/data/movies";

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

// Create mappings from our unified movies data
const movieTitleTranslations: Record<string, string> = {};
const frenchToEnglishTitles = new Map<string, string>();

// Normalize text for comparison (same as in fuzzyMatching.ts)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[-–—_']/g, ' ') // Replace hyphens/apostrophes with spaces
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Keep only letters, numbers, and spaces (Unicode-aware)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Build the translations from our unified movies data
movies.forEach(movie => {
  if (movie.frenchTitle && movie.frenchTitle !== movie.title) {
    movieTitleTranslations[movie.title] = movie.frenchTitle;
    frenchToEnglishTitles.set(normalizeText(movie.frenchTitle), movie.title);
  }
});

// Helper function to calculate Levenshtein distance for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};

// Function to check if a title matches with fuzzy matching
const isFuzzyMatch = (title: string, searchTerm: string, threshold = 0.25): boolean => {
  if (!title || !searchTerm) return false;
  
  const normalizedTitle = normalizeText(title);
  const normalizedSearch = normalizeText(searchTerm);
  
  // Check for partial match first (optimistic case)
  if (normalizedTitle.includes(normalizedSearch)) {
    return true;
  }
  
  // For very short search terms, be more strict about fuzzy matching
  if (normalizedSearch.length < 3) {
    return normalizedTitle.startsWith(normalizedSearch);
  }
  
  // Apply fuzzy matching for longer search terms
  const distance = levenshteinDistance(normalizedTitle, normalizedSearch);
  const maxLength = Math.max(normalizedTitle.length, normalizedSearch.length);
  const similarityRatio = 1 - distance / maxLength;
  
  return similarityRatio >= threshold;
};

// Helper function to filter movie results with fuzzy matching
const filterMoviesByPartialTitle = (movies: MovieSearchResult[], partialTitle: string): MovieSearchResult[] => {
  const normalizedPartial = normalizeText(partialTitle);
  
  // First get exact or partial matches
  const exactMatches = movies.filter(movie => {
    const englishMatches = normalizeText(movie.Title).includes(normalizedPartial);
    const frenchTitle = movieTitleTranslations[movie.Title];
    const frenchMatches = frenchTitle ? normalizeText(frenchTitle).includes(normalizedPartial) : false;
    
    // Add the French title to the movie object if it exists
    if (frenchTitle) {
      movie.frenchTitle = frenchTitle;
    }
    
    return englishMatches || frenchMatches;
  });
  
  // If we have exact matches, return them
  if (exactMatches.length > 0) {
    return exactMatches;
  }
  
  // Otherwise, try fuzzy matching
  return movies.filter(movie => {
    const englishFuzzyMatch = isFuzzyMatch(movie.Title, partialTitle);
    
    const frenchTitle = movieTitleTranslations[movie.Title];
    if (frenchTitle) {
      movie.frenchTitle = frenchTitle;
    }
    
    const frenchFuzzyMatch = frenchTitle ? isFuzzyMatch(frenchTitle, partialTitle) : false;
    
    return englishFuzzyMatch || frenchFuzzyMatch;
  });
};

// Find English title from French search term with fuzzy matching
const findEnglishTitleFromFrench = (frenchSearchTerm: string): string | null => {
  if (frenchSearchTerm.length < 2) return null;
  
  const normalizedSearchTerm = normalizeText(frenchSearchTerm);
  
  // First try exact matches
  for (const [normalizedFrenchTitle, englishTitle] of frenchToEnglishTitles.entries()) {
    if (normalizedFrenchTitle.includes(normalizedSearchTerm)) {
      return englishTitle;
    }
  }
  
  // Then try fuzzy matches
  let bestMatch: string | null = null;
  let bestSimilarity = 0;
  
  for (const [normalizedFrenchTitle, englishTitle] of frenchToEnglishTitles.entries()) {
    const distance = levenshteinDistance(normalizedFrenchTitle, normalizedSearchTerm);
    const maxLength = Math.max(normalizedFrenchTitle.length, normalizedSearchTerm.length);
    const similarity = 1 - distance / maxLength;
    
    if (similarity > 0.7 && similarity > bestSimilarity) {
      bestMatch = englishTitle;
      bestSimilarity = similarity;
    }
  }
  
  return bestMatch;
};

export const searchMovies = async (searchTerm: string): Promise<MovieSearchResult[]> => {
  try {
    // We now accept searches with only 1 character
    if (searchTerm.length < 1) {
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
    
    // Try fuzzy matching with cached results
    if (results.length === 0) {
      let fuzzyMatches: MovieSearchResult[] = [];
      
      LOCAL_CACHE.forEach((movies, cacheKey) => {
        // Use fuzzy matching for both the cache key and the movies
        if (isFuzzyMatch(cacheKey, searchTerm)) {
          const filteredMovies = filterMoviesByPartialTitle(movies, searchTerm);
          if (filteredMovies.length > 0) {
            fuzzyMatches.push(...filteredMovies);
          }
        }
      });
      
      if (fuzzyMatches.length > 0) {
        results = fuzzyMatches;
      }
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
    if (searchTerm.length > 1) {
      const prefix = searchTerm.substring(0, Math.min(3, searchTerm.length));
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
        
        // Return filtered results that match our search term with fuzzy matching
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

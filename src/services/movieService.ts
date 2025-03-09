
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

export const searchMovies = async (searchTerm: string): Promise<MovieSearchResult[]> => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`);
    const data: SearchResponse = await response.json();
    
    if (data.Response === "True") {
      return data.Search;
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

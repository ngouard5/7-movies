
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { searchMovies, MovieSearchResult } from "@/services/movieService";

export const useMovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch movie suggestions from OMDb API
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Search with a minimum of 2 characters
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchMovies(searchTerm);
          setSuggestions(results);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          toast({
            title: "Error",
            description: "Failed to fetch movie suggestions",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    // Small debounce timer to make search responsive without too many requests
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading
  };
};

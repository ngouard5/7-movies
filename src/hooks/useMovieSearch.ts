
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { searchMovies, MovieSearchResult } from "@/services/movieService";

export const useMovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch movie suggestions with debouncing
  const fetchSuggestions = useCallback(async (term: string) => {
    // Show suggestions with a minimum of 1 character instead of 2
    if (term.length >= 1) {
      setIsLoading(true);
      try {
        const results = await searchMovies(term);
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
  }, [toast]);

  // Use a shorter debounce timer and handle immediate search
  useEffect(() => {
    // Search immediately for better responsiveness
    const immediateTimer = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 150); // Reduced from 300ms for more immediate feedback

    return () => clearTimeout(immediateTimer);
  }, [searchTerm, fetchSuggestions]);

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    clearSuggestions: () => setSuggestions([])
  };
};

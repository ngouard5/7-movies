
// utils/movieUtils.ts

import { movieErrorMessages } from "@/data/movieErrorMessages";
import type { Movie } from "@/data/movies";

// Function to format time in seconds to mm:ss format
export const formatGameTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Function to get a random error message for wrong guesses
export const getRandomErrorMessage = (movieTitle: string): string => {
  const randomIndex = Math.floor(Math.random() * movieErrorMessages.length);
  return movieErrorMessages[randomIndex].replace("{movieTitle}", movieTitle);
};

// Function to get a subset of movies for the game
// Note: This function is now deprecated in favor of getRandomMovies from movies.ts
// Kept for backward compatibility
export const getGameMovies = (allMovies: Movie[], count: number = 7): Movie[] => {
  // Shuffle the array of movies
  const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
  
  // Take the first n elements
  return shuffled.slice(0, count);
};


// utils/movieUtils.ts

import { movieErrorMessages } from "@/data/movieErrorMessages";

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
export const getGameMovies = (allMovies: any[], count: number = 5) => {
  // Shuffle the array of movies
  const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
  
  // Take the first n elements
  return shuffled.slice(0, count);
};

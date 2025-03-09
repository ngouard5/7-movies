
import { MovieEmoji } from "@/data/movieEmojis";

// Helper function to shuffle array
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Error messages for wrong guesses
const errorMessages = [
  "That's not it! Try another movie.",
  "Not quite right, but you're on the right track!",
  "Good try, but not the movie we're looking for!",
  "Hmm, not that one. Keep guessing!",
  "Close, but not close enough. Try again!",
  "That's not the correct movie, try another one!",
  "Nice attempt, but that's not it!",
  "I'm thinking of a different movie. Try again!",
  "That's not right, but don't give up!",
  "Not that one, but you can do this!"
];

// Get random error message
export const getRandomErrorMessage = (movieTitle: string) => {
  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  return `${errorMessages[randomIndex]} "${movieTitle}" is not the answer.`;
};

// Format time to MM:SS
export const formatGameTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get game movies - either from challenge or random selection
export const getGameMovies = (movieEmojis: MovieEmoji[]): MovieEmoji[] => {
  const challengeMoviesStr = localStorage.getItem("challengeMovies");
  
  if (challengeMoviesStr) {
    try {
      // This is a challenge game
      const challengeMovieIds = JSON.parse(challengeMoviesStr);
      const moviesForChallenge = challengeMovieIds
        .map((id: number) => movieEmojis.find(movie => movie.id === id))
        .filter(Boolean);
      
      // Clear the challenge data after loading
      localStorage.removeItem("challengeMovies");
      
      if (moviesForChallenge.length > 0) {
        return moviesForChallenge;
      }
    } catch (e) {
      console.error("Error parsing challenge movies:", e);
    }
  }
  
  // Regular game - get 1 random movie for testing (changed from 7 to 1)
  return shuffleArray(movieEmojis).slice(0, 1);
};

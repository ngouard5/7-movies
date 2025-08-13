// Utility function to calculate score based on guess time
export const calculateScore = (guessTimeMs: number): number => {
  const guessTimeSeconds = Math.floor(guessTimeMs / 1000);
  
  // Base points for correct answer
  const basePoints = 100;
  
  // Speed bonus calculation
  let speedBonus = 0;
  if (guessTimeSeconds < 10) {
    speedBonus = 50;
  } else if (guessTimeSeconds < 20) {
    speedBonus = 30;
  } else if (guessTimeSeconds < 30) {
    speedBonus = 10;
  }
  // No bonus after 30 seconds
  
  return basePoints + speedBonus;
};

// Maximum possible score per movie
export const MAX_SCORE_PER_MOVIE = 150;

// Maximum possible total score for 7 movies
export const MAX_TOTAL_SCORE = MAX_SCORE_PER_MOVIE * 7; // 1050
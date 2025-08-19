// Fuzzy matching utility for movie titles

// Calculate Levenshtein distance between two strings
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

// Normalize text for comparison
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

// Extract keywords from title (remove common words)
const extractKeywords = (title: string): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'until', 'without', 'within'];
  
  return normalizeText(title)
    .split(' ')
    .filter(word => word.length > 3 && !commonWords.includes(word)); // Increased from 2 to 3
};

// Check if guess matches the movie title using fuzzy logic
export const isFuzzyMatch = (guess: string, movieTitle: string): boolean => {
  if (!guess || !movieTitle) return false;

  const normalizedGuess = normalizeText(guess);
  const normalizedTitle = normalizeText(movieTitle);

  // Exact match after normalization
  if (normalizedGuess === normalizedTitle) return true;

  // Check if guess is contained in title (partial match)
  // Stricter requirements to prevent overly permissive matches
  if (normalizedGuess.length >= 6 && 
      normalizedGuess.length >= normalizedTitle.length * 0.8 && 
      normalizedTitle.includes(normalizedGuess)) {
    // Additional check: ensure it's not just matching the beginning of a common word
    const words = normalizedTitle.split(' ');
    const hasFullWordMatch = words.some(word => word.includes(normalizedGuess) && normalizedGuess.length >= word.length * 0.7);
    if (hasFullWordMatch) return true;
  }

  // Check if title is contained in guess (user typed more than needed)
  if (normalizedGuess.includes(normalizedTitle)) return true;

  // Keyword matching - check if all important words from guess are in title
  const guessKeywords = extractKeywords(guess);
  const titleKeywords = extractKeywords(movieTitle);
  
  if (guessKeywords.length > 0 && guessKeywords.every(kw => kw.length >= 5)) {
    const matchedKeywords = guessKeywords.filter(keyword => 
      titleKeywords.some(titleKeyword => 
        titleKeyword.includes(keyword) || (keyword.includes(titleKeyword) && titleKeyword.length >= 4)
      )
    );
    
    // Require ALL keywords to match for short guesses, most for longer ones
    const requiredMatches = guessKeywords.length <= 2 ? guessKeywords.length : Math.ceil(guessKeywords.length * 0.9);
    if (matchedKeywords.length >= requiredMatches) {
      return true;
    }
  }

  // Levenshtein distance for typo tolerance
  const distance = levenshteinDistance(normalizedGuess, normalizedTitle);
  const maxLength = Math.max(normalizedGuess.length, normalizedTitle.length);
  const similarity = 1 - distance / maxLength;

  // Stricter thresholds to prevent overly permissive matching
  const threshold = maxLength < 6 ? 0.8 : maxLength < 10 ? 0.75 : 0.85;
  
  return similarity >= threshold;
};

// Check if two movie titles refer to the same movie (for variants like "Seven"/"Se7en")
export const isMovieVariant = (guess: string, movieTitle: string): boolean => {
  const variants = new Map([
    ['seven', 'se7en'],
    ['se7en', 'seven'],
    // Add more variants as needed
  ]);

  const normalizedGuess = normalizeText(guess);
  const normalizedTitle = normalizeText(movieTitle);

  return variants.get(normalizedGuess) === normalizedTitle || 
         variants.get(normalizedTitle) === normalizedGuess;
};

// Get a suggestion for a close but not exact match
export const getSuggestion = (guess: string, movieTitle: string): string | null => {
  const normalizedGuess = normalizeText(guess);
  const normalizedTitle = normalizeText(movieTitle);

  // If it's very close, suggest the correct title
  const distance = levenshteinDistance(normalizedGuess, normalizedTitle);
  const maxLength = Math.max(normalizedGuess.length, normalizedTitle.length);
  const similarity = 1 - distance / maxLength;

  if (similarity > 0.6 && similarity < 0.8) {
    return `Try "${movieTitle}"`;
  }

  return null;
};
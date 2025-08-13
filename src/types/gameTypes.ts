
export interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number; // Time it took to guess this specific movie
  frenchTitle?: string; // French title of the movie
  points?: number; // Points earned for this movie
  genre?: string; // Movie genre
  year?: number; // Release year
  director?: string; // Director name
  mainActor?: string; // Main actor name
}

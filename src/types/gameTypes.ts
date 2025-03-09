
export interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number; // Time it took to guess this specific movie
}

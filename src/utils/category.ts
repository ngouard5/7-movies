import { Movie } from "@/data/movies";

export type CategoryKey = 'all' | 'disney' | 'blockbusters' | 'superheroes' | 'animation' | 'true_stories' | 'comedies' | 'fantasy' | 'scifi';

const movieMatchesCategory = (movie: Movie, category: CategoryKey): boolean => {
  switch (category) {
    case 'all': return true;
    case 'disney': return !!movie.tags?.includes('disney');
    case 'blockbusters': return !!movie.tags?.includes('blockbusters');
    case 'superheroes': return !!movie.tags?.includes('superhero');
    case 'animation': return !!movie.genre?.includes('Animation');
    case 'true_stories': return !!movie.tags?.includes('true_story');
    case 'comedies': return !!movie.genre?.includes('Comédie');
    case 'fantasy': return !!movie.genre?.includes('Fantastique');
    case 'scifi': return !!movie.genre?.includes('Science-Fiction');
    default: return true;
  }
};

export const filterMoviesByCategory = (movies: Movie[], categories: CategoryKey[]): Movie[] => {
  if (categories.length === 0) return movies;
  return movies.filter(movie => categories.some(cat => movieMatchesCategory(movie, cat)));
};
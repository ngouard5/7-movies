import { Movie } from "@/data/movies";

export type CategoryKey = 'all' | 'disney' | 'blockbusters' | 'superheroes' | 'animation' | 'true_stories' | 'comedies' | 'fantasy' | 'scifi';

export const filterMoviesByCategory = (movies: Movie[], category: CategoryKey): Movie[] => {
  if (category === 'all') {
    return movies;
  }

  return movies.filter(movie => {
    switch (category) {
      case 'disney':
        return movie.tags?.includes('disney');
      case 'blockbusters':
        return movie.tags?.includes('blockbusters');
      case 'superheroes':
        return movie.tags?.includes('superhero');
      case 'animation':
        return movie.genre?.includes('Animation');
      case 'true_stories':
        return movie.tags?.includes('true_story');
      case 'comedies':
        return movie.genre?.includes('Comédie');
      case 'fantasy':
        return movie.genre?.includes('Fantastique');
      case 'scifi':
        return movie.genre?.includes('Science-Fiction');
      default:
        return true;
    }
  });
};
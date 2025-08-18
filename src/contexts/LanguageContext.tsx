
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Common translations for the app
const translations = {
  en: {
    // Home page
    'find.movies': 'Find 7 movies with emojis',
    'game.description': 'Guess 7 movie titles based on emojis, in the shortest period of time!',
    'challenge.friends': 'Challenge your friends to beat your record!',
    'play.button': 'Play now',
    'how.to.play': 'How to play',
    
    // Pre-game
    'before.we.start': 'Before we start...',
    'accept.challenge': 'Accept the challenge!',
    'your.nickname': 'Your nickname',
    'enter.nickname': 'Enter your nickname',
    'choose.avatar': 'Choose your avatar',
    'start.game': 'Start the game!',
    'accept.challenge.button': 'Accept Challenge',
    
    // Countdown
    'welcome': 'Welcome',
    'game.start.in': 'The game will start in',
    
    // Game
    'movie.counter': 'Movie',
    'type.movie.title': 'Type a movie title...',
    'wrong.guess': 'That\'s not it. Try again!',
    
    // How to play
    'how.to.play.title': 'How to play',
    'step1.description': 'Start a new game and choose your nickname and emoji',
    'step2.description': 'Find movie titles as fast as you can',
    'step3.description': 'You can write titles both in 🇫🇷 and 🇬🇧',
    'step4.description': 'Challenge your friends to beat your score!',

    'howtoplay.movie1': 'The Lion King',
    'howtoplay.movie2': 'Harry Potter and the Philosopher\'s Stone',
    'howtoplay.movie3': 'The Matrix',


    // Results
    'go.home': 'Go to the homepage',
    'hint.first.letter': 'Hint: Title starts with',
    'hint.first.letter.words': 'Hint: First letters of each word:',
    'and.has': 'and has',
    'word': 'word',
    'words': 'words',
    'play.again': 'Play again',
    
    // Share
    'share.button': 'Challenge your friends',
    'share.copied': 'Copied!',
    'share.copy.success': 'Challenge link copied!',
    'share.copy.error': 'Copy failed',
    'share.web.title': 'Movie Emoji Challenge',
    
    // Challenge page
    'challenge.accepted': 'Challenge accepted!',
    'challenge.loading': 'Loading challenge...',
    'challenge.not.found': 'Challenge not found',
    'challenge.not.found.desc': 'This challenge may have expired or been removed.',
    'challenge.back.home': 'Back to home',
    'challenge.start': 'Start Challenge',
    'challenge.description': 'You will have 7 movies to guess, based on emojis. The faster you are, the more you score points!',
    'challenge.score.beat': 'Score to beat:',
    
    // Game interface
    'skip': 'Skip',
    'confirm': 'Confirm',
    'i.need.hint': 'I need a hint',
    'back': 'Back',
    'start.new.game': 'Start a new game',
    'examples': 'Examples',
    'guess.titles': 'Guess the movie titles',
    'how.scores.work': 'How the scores work?',
    'scores.base': 'You earn 100 pts for each movie you find.',
    'scores.bonus.intro': 'Then you get bonus points depending on your quickness:',
    'scores.bonus.50': '+50 pts before 10 seconds',
    'scores.bonus.30': '+30 pts between 10 and 20 seconds',
    'scores.bonus.10': '+10 pts between 20 and 30 seconds',
    
    // Results
    'results.points': 'points',
    'results.movies.guessed': 'Movies guessed',
    'results.total.time': 'Total time',
    'results.guessed.movies': 'Guessed Movies',
    'results.passed.movies': 'Passed Movies',
    
    // Hints
    'hint.label': 'Hint',
    'hint.directed.by': 'Directed by',
    'hint.starring': 'Starring',
    
    // Score popup
    'score.correct': 'Correct answer',
    'score.speed.bonus': 'Speed bonus',
    'score.no.speed.bonus': 'No speed bonus (>30s)',
    
    // Footer
    'footer.made.with': '7 movies is an after dinner project made with 🍿',
    'footer.contact': 'If you have suggestions please',
    'footer.contact.link': 'contact me',
  },
  fr: {
    // Page d'accueil
    'find.movies': 'Trouvez 7 films avec des émojis',
    'game.description': 'Devinez 7 titres de films à partir d\'émojis, dans le temps le plus court possible !',
    'challenge.friends': 'Défiez vos amis pour battre votre record !',
    'play.button': 'Jouer maintenant',
    'how.to.play': 'Comment jouer',
    
    // Pré-jeu
    'before.we.start': 'Avant de commencer...',
    'accept.challenge': 'Acceptez le défi !',
    'your.nickname': 'Votre pseudo',
    'enter.nickname': 'Entrez votre pseudo',
    'choose.avatar': 'Choisissez votre avatar',
    'start.game': 'Commencer le jeu !',
    'accept.challenge.button': 'Accepter le défi',
    
    // Compte à rebours
    'welcome': 'Bienvenue',
    'game.start.in': 'Le jeu commencera dans',
    
    // Jeu
    'movie.counter': 'Film',
    'type.movie.title': 'Tapez un titre de film...',
    'wrong.guess': 'Ce n\'est pas ça. Essayez encore !',
    
    // Comment jouer
    'how.to.play.title': 'Comment jouer',
    'step1.description': 'Commencez une partie et choisissez un pseudo et un emoji',
    'step2.description': 'Trouvez les titres films le plus rapidement possuble',
    'step3.description': 'Vous pouvez écrire les titres en 🇫🇷 ou en 🇬🇧',
    'step4.description': 'Défiez vos amis et battez leur score !',

    'howtoplay.movie1': 'Le Roi Lion',
    'howtoplay.movie2': 'Harry Potter à l\'école des sorciers',
    'howtoplay.movie3': 'Matrix',

    // Résultats
    'go.home': 'Retourner à l\'accueil',
    'hint.first.letter': 'Indice : Le titre commence par',
    'hint.first.letter.words': 'Indice : Premières lettres de chaque mot :',
    'and.has': 'et contient',
    'word': 'mot',
    'words': 'mots',
    'play.again': 'Jouer à nouveau',
    
    // Partage
    'share.button': 'Défiez vos amis',
    'share.copied': 'Copié !',
    'share.copy.success': 'Lien de défi copié !',
    'share.copy.error': 'Erreur lors de la copie',
    'share.web.title': 'Défi Movie Emoji',
    
    // Page de défi
    'challenge.accepted': 'Défi accepté !',
    'challenge.loading': 'Chargement du défi...',
    'challenge.not.found': 'Défi introuvable',
    'challenge.not.found.desc': 'Ce défi a peut-être expiré ou été supprimé.',
    'challenge.back.home': 'Retour à l\'accueil',
    'challenge.start': 'Commencer le défi',
    'challenge.description': 'Vous devez deviner 7 films à partir d\'émojis. Plus vous êtes rapide, plus vous marquez de points !',
    'challenge.score.beat': 'Score à battre :',
    
    // Interface de jeu
    'skip': 'Passer',
    'confirm': 'Valider',
    'i.need.hint': 'J\'ai besoin d\'un indice',
    'back': 'Retour',
    'start.new.game': 'Commencer une nouvelle partie',
    'examples': 'Exemples',
    'guess.titles': 'Devinez les titres des films',
    'how.scores.work': 'Comment fonctionne le score ?',
    'scores.base': 'Vous gagnez 100 pts pour chaque film trouvé.',
    'scores.bonus.intro': 'Puis vous obtenez des points bonus selon votre rapidité :',
    'scores.bonus.50': '+50 pts avant 10 secondes',
    'scores.bonus.30': '+30 pts entre 10 et 20 secondes',
    'scores.bonus.10': '+10 pts entre 20 et 30 secondes',
    
    // Résultats
    'results.points': 'points',
    'results.movies.guessed': 'Films trouvés',
    'results.total.time': 'Temps total',
    'results.guessed.movies': 'Films trouvés',
    'results.passed.movies': 'Films passés',
    
    // Indices
    'hint.label': 'Indice',
    'hint.directed.by': 'Réalisé par',
    'hint.starring': 'Avec',
    
    // Popup de score
    'score.correct': 'Bonne réponse',
    'score.speed.bonus': 'Bonus vitesse',
    'score.no.speed.bonus': 'Pas de bonus vitesse (>30s)',
    
    // Pied de page
    'footer.made.with': '7 movies est un projet after-dinner fait avec 🍿',
    'footer.contact': 'Si vous avez des suggestions,',
    'footer.contact.link': 'contactez-moi',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to get saved language from localStorage or detect browser language
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'fr' || savedLanguage === 'en') {
      return savedLanguage as Language;
    }
    
    // Auto-detect from browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  });

  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Save language preference and update document language when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

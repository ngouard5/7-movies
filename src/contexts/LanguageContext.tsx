
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
    'step1.title': 'Choose your avatar',
    'step1.description': 'Select an emoji that represents you and enter your nickname.',
    'step2.title': 'Get ready',
    'step2.description': 'A countdown will give you time to prepare. When it reaches zero, the game starts!',
    'step3.title': 'Guess the movies',
    'step3.description': 'You\'ll see a series of emojis that represent a movie title. Type your guess in the search box.',
    'step4.title': 'Beat the clock',
    'step4.description': 'Try to guess all 7 movies as quickly as possible. Your time is being recorded!',
    'step5.title': 'Challenge friends',
    'step5.description': 'Share your result with friends and challenge them to beat your time with the same movies!',

    // Results
    'go.home': 'Go to the homepage',
    'hint.first.letter': 'Hint: Title starts with',
    'hint.first.letter.words': 'Hint: First letters of each word:',
    'and.has': 'and has',
    'word': 'word',
    'words': 'words',
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
    'step1.title': 'Choisissez votre avatar',
    'step1.description': 'Sélectionnez un émoji qui vous représente et entrez votre pseudo.',
    'step2.title': 'Préparez-vous',
    'step2.description': 'Un compte à rebours vous donnera le temps de vous préparer. Quand il atteint zéro, le jeu commence !',
    'step3.title': 'Devinez les films',
    'step3.description': 'Vous verrez une série d\'émojis qui représentent un titre de film. Tapez votre réponse dans la barre de recherche.',
    'step4.title': 'Battez l\'horloge',
    'step4.description': 'Essayez de deviner les 7 films le plus rapidement possible. Votre temps est enregistré !',
    'step5.title': 'Défiez vos amis',
    'step5.description': 'Partagez votre résultat avec vos amis et défiez-les de battre votre temps avec les mêmes films !',

    // Résultats
    'go.home': 'Retourner à l\'accueil',
    'hint.first.letter': 'Indice : Le titre commence par',
    'hint.first.letter.words': 'Indice : Premières lettres de chaque mot :',
    'and.has': 'et contient',
    'word': 'mot',
    'words': 'mots',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to get saved language from localStorage, default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'fr' ? 'fr' : 'en') as Language;
  });

  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

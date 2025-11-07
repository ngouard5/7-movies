import React, { useEffect, useState } from "react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameTimer } from "@/components/game/GameTimer";
import { MovieCounter } from "@/components/game/MovieCounter";
import { EmojiDisplay } from "@/components/game/EmojiDisplay";
import { MovieSearchInput } from "@/components/game/MovieSearchInput";
import { MovieAutocomplete } from "@/components/game/MovieAutocomplete";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { SkipForward, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchLocalMovies } from "@/services/movieService";

const Game = () => {
  const { t, language } = useLanguage();
  const {
    currentMovieIndex,
    searchTerm,
    setSearchTerm,
    timer,
    wrongGuess,
    inputRef,
    currentMovie,
    handleGuess,
    formatTime,
    totalMovies,
    answerStatus,
    showHint,
    hint,
    handlePass,
    requestHint,
    cycleHint,
    showScorePopup,
    lastScore
  } = useGameLogic();

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Array<{title: string, year: number, frenchTitle?: string}>>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 1) {
        const results = searchLocalMovies(searchTerm, 5);
        setSuggestions(results);
        setShowAutocomplete(results.length > 0);
      } else {
        setSuggestions([]);
        setShowAutocomplete(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle suggestion click
  const handleSuggestionClick = (title: string) => {
    handleGuess(title);
    setSearchTerm("");
    setSuggestions([]);
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  // Clear autocomplete when input loses focus or user types
  const handleInputChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Convert boolean to string for the MovieSearchInput component
  const wrongGuessMessage = wrongGuess ? t('wrong.guess') : null;

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen md:min-h-[600px] mx-auto my-0">
        <div className="relative flex flex-col">

          {/* Header with MovieCounter, Timer, and Skip button - Sticky */}
          <header className="sticky top-0 h-[80px] grid grid-cols-3 items-center px-4 z-20">
            <div className="flex justify-start">
              <MovieCounter currentIndex={currentMovieIndex} totalMovies={totalMovies} />
            </div>
            <div className="flex justify-center">
              <GameTimer timer={timer} formatTime={formatTime} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePass} className="flex items-center gap-2 bg-white border border-[#CCC] text-black shadow-[0px_3px_3px_rgba(0,0,0,0.06)] hover:bg-gray-50 font-sf" size="sm">
                {t('skip')}
                <SkipForward className="w-4 h-4 text-[#E72F2F]" />
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center">
            {/* Emoji Display - Sticky */}
            <div className="w-full mb-6 sticky top-[80px] z-10 bg-neutral-50">
              <EmojiDisplay 
                emojis={currentMovie.emojis} 
                status={answerStatus}
                movieData={answerStatus === "correct" && lastScore ? lastScore.guessedMovie : undefined}
                basePoints={answerStatus === "correct" && lastScore ? lastScore.basePoints : undefined}
                speedBonus={answerStatus === "correct" && lastScore ? lastScore.speedBonus : undefined}
                totalPoints={answerStatus === "correct" && lastScore ? lastScore.totalPoints : undefined}
                language={language}
              />
            </div>

            <div className="w-full max-w-[400px] relative px-4 mx-auto">
            {/* Input and Autocomplete Container - Hidden when answer is correct */}
            {answerStatus !== 'correct' && (
              <div className="w-full max-w-[400px] relative mb-6 mx-auto">
                <MovieSearchInput 
                  searchTerm={searchTerm} 
                  setSearchTerm={handleInputChange} 
                  inputRef={inputRef} 
                  handleGuess={handleGuess} 
                  wrongGuess={wrongGuessMessage} 
                  showHint={showHint} 
                  answerStatus={answerStatus} 
                />
                
                {/* Autocomplete suggestions */}
                <MovieAutocomplete 
                  suggestions={suggestions}
                  isOpen={showAutocomplete}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            )}

            {/* I need a hint button - only show if hint is not visible and answer is not correct */}
            {!showHint && answerStatus !== 'correct' && (
              <Button onClick={requestHint} variant="outline" className="w-full max-w-[400px] h-10 mb-4 text-sm font-sf">
                💡 {t('i.need.hint')}
              </Button>
            )}

            {/* Hint display - clickable area */}
            {showHint && hint && answerStatus !== 'correct' && (
              <button 
                onClick={cycleHint} 
                className="w-full max-w-[400px] bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer mb-4 text-left"
              >
                <div className="flex items-center">
                  <span className="mr-2">💡</span>
                  {hint}
                </div>
                <RefreshCw className="w-3 h-3 ml-2 flex-shrink-0" />
              </button>
            )}

            {/* Message display for wrong guesses - after hint */}
            {wrongGuessMessage && answerStatus !== 'correct' && (
              <div className="text-center mb-4 font-sf max-w-[400px]">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  {wrongGuessMessage}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Game;


import React from "react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameTimer } from "@/components/game/GameTimer";
import { MovieCounter } from "@/components/game/MovieCounter";
import { EmojiDisplay } from "@/components/game/EmojiDisplay";
import { MovieSearchInput } from "@/components/game/MovieSearchInput";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const Game = () => {
  const {
    currentMovieIndex,
    searchTerm,
    setSearchTerm,
    suggestions,
    timer,
    wrongGuess,
    isLoading,
    inputRef,
    currentMovie,
    handleGuess,
    formatTime,
    totalMovies,
    answerStatus,
    showHint,
    hint,
    handlePass
  } = useGameLogic();

  // Convert boolean to string for the MovieSearchInput component
  const wrongGuessMessage = wrongGuess ? hint || "That's not it. Try again!" : null;

  return (
    <AppLayout>
      <main className="relative w-full min-h-[852px] overflow-hidden bg-neutral-50 mx-auto">
        <BackgroundGradients />
        
        {/* Timer */}
        <GameTimer timer={timer} formatTime={formatTime} />
        
        {/* Movie counter */}
        <MovieCounter currentIndex={currentMovieIndex} totalMovies={totalMovies} />
        
        {/* Yellow emojis section */}
        <EmojiDisplay emojis={currentMovie.emojis} status={answerStatus} />
        
        {/* Input section */}
        <MovieSearchInput 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          suggestions={suggestions}
          isLoading={isLoading}
          inputRef={inputRef}
          handleGuess={handleGuess}
          wrongGuess={wrongGuessMessage}
          showHint={showHint}
        />
        
        {/* Pass button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-[90%] max-w-[361px]">
          <Button 
            variant="outline"
            className="w-full mt-4 border-gray-300 text-gray-500 hover:bg-gray-100 rounded-2xl"
            onClick={handlePass}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Pass
          </Button>
        </div>
      </main>
    </AppLayout>
  );
};

export default Game;

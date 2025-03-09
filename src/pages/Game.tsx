
import React from "react";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameTimer } from "@/components/game/GameTimer";
import { MovieCounter } from "@/components/game/MovieCounter";
import { EmojiDisplay } from "@/components/game/EmojiDisplay";
import { MovieSearchInput } from "@/components/game/MovieSearchInput";
import { useGameLogic } from "@/hooks/useGameLogic";

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
    answerStatus
  } = useGameLogic();

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <BackgroundGradients />
      
      {/* Header with menu button */}
      <div className="absolute left-4 top-[69px]">
        <MenuButton />
      </div>
      
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
        wrongGuess={wrongGuess ? "That's not it. Try again!" : null}
      />
    </main>
  );
};

export default Game;

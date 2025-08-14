import React from "react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameTimer } from "@/components/game/GameTimer";
import { MovieCounter } from "@/components/game/MovieCounter";
import { EmojiDisplay } from "@/components/game/EmojiDisplay";
import { MovieSearchInput } from "@/components/game/MovieSearchInput";
import { ScorePopup } from "@/components/game/ScorePopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const Game = () => {
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
    showScorePopup,
    lastScore
  } = useGameLogic();

  // Convert boolean to string for the MovieSearchInput component
  const wrongGuessMessage = wrongGuess ? hint || "That's not it. Try again!" : null;

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen overflow-auto bg-neutral-50 mx-auto my-0">
        <div className="relative flex flex-col">
          <BackgroundGradients />

          {/* Header with MovieCounter, Timer, and Skip button - Sticky */}
          <header className="sticky top-0 h-[80px] grid grid-cols-3 items-center px-4 z-20 bg-neutral-50">
            <div className="flex justify-start">
              <MovieCounter currentIndex={currentMovieIndex} totalMovies={totalMovies} />
            </div>
            <div className="flex justify-center">
              <GameTimer timer={timer} formatTime={formatTime} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePass} className="flex items-center gap-2 bg-white border border-[#CCC] text-black shadow-[0px_3px_3px_rgba(0,0,0,0.06)] hover:bg-gray-50 font-sf" size="sm">
                Skip
                <SkipForward className="w-4 h-4 text-[#E72F2F]" />
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center px-0">
            {/* Emoji Display - Sticky */}
            <div className="w-full sticky top-[80px] z-10 bg-neutral-50">
              <EmojiDisplay emojis={currentMovie.emojis} status={answerStatus} />
            </div>

            {/* Input and Score Popup Container */}
            <div className="w-full max-w-[361px] relative mb-6 mx-auto">
              <MovieSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} inputRef={inputRef} handleGuess={handleGuess} wrongGuess={wrongGuessMessage} showHint={showHint} answerStatus={answerStatus} />
              
              {/* Score popup positioned relative to input */}
              {lastScore && <ScorePopup show={showScorePopup} basePoints={lastScore.basePoints} speedBonus={lastScore.speedBonus} totalPoints={lastScore.totalPoints} currentMovie={lastScore.guessedMovie} />}
            </div>

            {/* Confirm Button */}
            <Button onClick={() => {
            if (searchTerm.trim()) {
              handleGuess(searchTerm.trim());
              setSearchTerm("");
            }
          }} className="w-full max-w-[361px] h-14 bg-[#E72F2F] text-white text-xl font-bold rounded-2xl shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] hover:bg-[#d62b2b] transition-colors mb-6 font-sf">
              Confirm
            </Button>

            {/* Message display for wrong guesses or hints */}
            {wrongGuessMessage && <div className="text-center mb-4 font-sf max-w-[361px]">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  <span className="mr-2">💡</span>
                  {wrongGuessMessage}
                </div>
              </div>}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Game;

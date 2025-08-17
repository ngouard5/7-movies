import React, { useEffect } from "react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameTimer } from "@/components/game/GameTimer";
import { MovieCounter } from "@/components/game/MovieCounter";
import { EmojiDisplay } from "@/components/game/EmojiDisplay";
import { MovieSearchInput } from "@/components/game/MovieSearchInput";
import { ScorePopup } from "@/components/game/ScorePopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { SkipForward, RefreshCw } from "lucide-react";
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
    requestHint,
    cycleHint,
    showScorePopup,
    lastScore
  } = useGameLogic();

  // Ajoute ce useEffect ici :
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Convert boolean to string for the MovieSearchInput component
  const wrongGuessMessage = wrongGuess ? "That's not it. Try again!" : null;

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen md:min-h-[600px] overflow-auto mx-auto my-0">
        <div className="relative flex flex-col">
          <BackgroundGradients />

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
                Skip
                <SkipForward className="w-4 h-4 text-[#E72F2F]" />
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center px-0">
            {/* Emoji Display - Sticky */}
            <div className="w-full mb-6 sticky top-[80px] z-10 bg-neutral-50">
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
                inputRef.current?.focus();
              }
            }} className="w-full max-w-[361px] h-14 bg-[#E72F2F] text-white text-xl font-bold rounded-2xl shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] hover:bg-[#d62b2b] transition-colors mb-4 font-sf">
              Confirm
            </Button>

            {/* I need a hint button - only show if hint is not visible */}
            {!showHint && (
              <Button onClick={requestHint} variant="outline" className="w-full max-w-[361px] h-10 mb-4 text-sm font-sf">
                I need a hint
              </Button>
            )}

            {/* Message display for wrong guesses */}
            {wrongGuessMessage && <div className="text-center mb-4 font-sf max-w-[361px]">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  {wrongGuessMessage}
                </div>
              </div>}

            {/* Hint display with refresh button */}
            {showHint && hint && (
              <div className="text-center mb-4 font-sf max-w-[361px]">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">💡</span>
                    {hint}
                  </div>
                  <Button onClick={cycleHint} variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Game;

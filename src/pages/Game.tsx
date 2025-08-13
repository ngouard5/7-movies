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
  return <AppLayout>
      <main className="relative w-full min-h-screen bg-neutral-50">
        <BackgroundGradients />
        
        {/* Header: Movie counter on left, timer center, skip button on right */}
        <div className="sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-sm">
          <div className="flex justify-between items-center p-4">
            <MovieCounter currentIndex={currentMovieIndex} totalMovies={totalMovies} />
            <GameTimer timer={timer} formatTime={formatTime} />
            <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent rounded-xl h-12 px-4 text-[16px]" onClick={handlePass}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col items-center px-4 space-y-6 pb-8">
          {/* Emojis section */}
          <EmojiDisplay emojis={currentMovie.emojis} status={answerStatus} />
          
          {/* Input with relative positioning for popup */}
          <div className="w-full max-w-[361px] relative">
            <MovieSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} inputRef={inputRef} handleGuess={handleGuess} wrongGuess={wrongGuessMessage} showHint={showHint} answerStatus={answerStatus} />
            
            {/* Score popup positioned right below input */}
            {lastScore && <ScorePopup show={showScorePopup} basePoints={lastScore.basePoints} speedBonus={lastScore.speedBonus} totalPoints={lastScore.totalPoints} currentMovie={lastScore.guessedMovie} />}
          </div>
          
          {/* Validate button */}
          <div className="w-full max-w-[361px]">
            <Button variant="destructive" className="w-full rounded-xl h-12 text-[16px] font-medium" onClick={() => {
            if (searchTerm.trim()) {
              handleGuess(searchTerm.trim());
              setSearchTerm("");
            }
          }} disabled={!searchTerm.trim()}>Confirm</Button>
          </div>
          
          
          {/* Hint message - appears after skip button */}
          {wrongGuessMessage && <div className={`w-full max-w-[361px] p-4 rounded-xl border ${showHint ? 'bg-[#FFF8E0] border-[#F0C000]' : 'bg-[#FADEDE] border-[#E72F2F]'}`}>
              <p className="text-[18px] text-foreground">{wrongGuessMessage}</p>
            </div>}
        </div>
      </main>
    </AppLayout>;
};
export default Game;
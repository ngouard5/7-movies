
import React from "react";

interface MovieSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleGuess: (movieTitle: string) => void;
  wrongGuess: string | null;
  showHint?: boolean;
  answerStatus: "wrong" | "correct" | null;
}

export const MovieSearchInput: React.FC<MovieSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  handleGuess,
  wrongGuess,
  showHint = false,
  answerStatus,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleGuess(searchTerm.trim());
      setSearchTerm(""); // Clear input after guess
    }
  };
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[360px] w-full max-w-[361px]">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid text-[18px] transition-colors ${
            answerStatus === 'correct' 
              ? 'border-green-500' 
              : answerStatus === 'wrong' 
                ? 'border-red-500' 
                : 'border-[#CCC]'
          }`}
          placeholder="Type a movie title and press Enter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Wrong guess message or hint */}
      {wrongGuess && (
        <div className={`mt-6 p-4 rounded-xl border ${showHint ? 'bg-[#FFF8E0] border-[#F0C000]' : 'bg-[#FADEDE] border-[#E72F2F]'}`}>
          <p className="text-[18px] text-[#191919]">{wrongGuess}</p>
        </div>
      )}
    </div>
  );
};

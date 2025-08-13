import React from "react";
import { Button } from "@/components/ui/button";
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
  answerStatus
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleGuess(searchTerm.trim());
      setSearchTerm(""); // Clear input after guess
    }
  };
  const handleSubmit = () => {
    if (searchTerm.trim()) {
      handleGuess(searchTerm.trim());
      setSearchTerm(""); // Clear input after guess
    }
  };
  return <div className="w-full space-y-3">
      <div className="relative">
        <input ref={inputRef} type="text" className={`w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-background rounded-xl border-solid text-[18px] transition-colors ${answerStatus === 'correct' ? 'border-green-500' : answerStatus === 'wrong' ? 'border-red-500' : 'border-border'}`} placeholder="Type a movie title and press Enter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} autoComplete="off" autoCorrect="off" spellCheck="false" />
      </div>

      {/* Validate button */}
      <Button onClick={handleSubmit} disabled={!searchTerm.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-[16px] font-medium">Confirm</Button>
    </div>;
};
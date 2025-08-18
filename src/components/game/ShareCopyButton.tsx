import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Check, Copy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShareCopyButtonProps {
  challengeSourceScore: number;
  currentScore: number;
  moviesGuessed: number;
  totalMovies: number;
}

export const ShareCopyButton: React.FC<ShareCopyButtonProps> = ({
  challengeSourceScore,
  currentScore,
  moviesGuessed,
  totalMovies
}) => {
  const [isShared, setIsShared] = useState(false);
  const { t, language } = useLanguage();

  const getShareMessage = () => {
    if (currentScore > challengeSourceScore) {
      // Player won
      return language === 'fr' 
        ? `J'ai gagné 🥳 ! J'ai trouvé ${moviesGuessed}/${totalMovies} films - ${currentScore} points 🍿`
        : `I won 🥳! I found ${moviesGuessed}/${totalMovies} movies - ${currentScore} points 🍿`;
    } else if (currentScore < challengeSourceScore) {
      // Player lost
      return language === 'fr'
        ? `Bravo tu as gagné 😡 ! J'ai trouvé ${moviesGuessed}/${totalMovies} films - ${currentScore} points 🍿`
        : `Well done you won 😡! I found ${moviesGuessed}/${totalMovies} movies - ${currentScore} points 🍿`;
    } else {
      // Tie
      return language === 'fr'
        ? `Égalité parfaite ! J'ai trouvé ${moviesGuessed}/${totalMovies} films - ${currentScore} points 🍿`
        : `Perfect tie! I found ${moviesGuessed}/${totalMovies} movies - ${currentScore} points 🍿`;
    }
  };

  const handleShare = async () => {
    const message = getShareMessage();
    
    try {
      // Try Web Share API first
      if (navigator.share) {
        await navigator.share({
          text: message
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
        return;
      }

      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(message);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
      
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback: try to copy using older method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
    }
  };

  const buttonText = language === 'fr' ? 'Partager mon score' : 'Share my score';
  const successText = language === 'fr' ? 'Copié !' : 'Copied!';

  return (
    <button
      onClick={handleShare}
      className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors font-sf flex items-center justify-center gap-2"
      disabled={false}
    >
      {isShared ? (
        <>
          <Check className="w-5 h-5" />
          {successText}
        </>
      ) : (
        <>
          {navigator.share ? <Share className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {buttonText}
        </>
      )}
    </button>
  );
};
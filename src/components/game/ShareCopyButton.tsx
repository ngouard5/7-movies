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
    <Button
      onClick={handleShare}
      className="flex items-center gap-2 w-full"
      variant="outline"
    >
      {isShared ? (
        <>
          <Check className="w-4 h-4" />
          {successText}
        </>
      ) : (
        <>
          {navigator.share ? <Share className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {buttonText}
        </>
      )}
    </Button>
  );
};
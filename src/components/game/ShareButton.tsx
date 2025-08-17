
import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareButtonProps {
  sessionId: string;
  playerNickname: string;
  score: number;
  totalMovies: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  sessionId,
  playerNickname,
  score,
  totalMovies
}) => {
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();

  const shareUrl = `${window.location.origin}/challenge/${sessionId}`;
  
  // Get total score from localStorage
  let totalScore = 0;
  try {
    const gameResults = localStorage.getItem('gameResults');
    if (gameResults) {
      const parsed = JSON.parse(gameResults);
      totalScore = parsed.totalScore || 0;
    } else {
      // Fallback to old totalScore key for compatibility
      totalScore = localStorage.getItem('totalScore') ? parseInt(localStorage.getItem('totalScore')!) : 0;
    }
  } catch (error) {
    totalScore = 0;
  }
  
  const shareText = language === 'fr' 
    ? `🎬 ${playerNickname} vous lance un défi movie emoji ! Ils ont trouvé ${score}/${totalMovies} films et marqué ${totalScore} pts. Saurez-vous faire mieux ?`
    : `🎬 ${playerNickname} challenges you to a Movie Emoji game! They guessed ${score}/${totalMovies} movies and scored ${totalScore} pts. Can you beat them?`;

  const handleShare = async () => {
    // Try to use native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share.web.title'),
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // Fall back to copy if share was cancelled
        console.log("Share cancelled or failed, falling back to copy");
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast.success(t('share.copy.success'));
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t('share.copy.error'));
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors font-sf flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-600" />
          {t('share.copied')}
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 text-white" />
          {t('share.button')}
        </>
      )}
    </Button>
  );
};

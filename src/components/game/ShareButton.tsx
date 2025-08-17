
import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const shareUrl = `${window.location.origin}/challenge/${sessionId}`;
  const shareText = `🎬 ${playerNickname} vous lance un défi movie emoji ! Ils ont trouvé ${score}/${totalMovies} films. Saurez-vous faire mieux ?`;

  const handleShare = async () => {
    // Try to use native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Défi Movie Emoji",
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
      toast.success("Lien de défi copié !");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Erreur lors de la copie");
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="w-full h-14 border text-[#191919] text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08)] bg-white rounded-2xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors font-sf flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-600" />
          Copié !
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 text-[#E72F2F]" />
          Partager ce défi
        </>
      )}
    </Button>
  );
};

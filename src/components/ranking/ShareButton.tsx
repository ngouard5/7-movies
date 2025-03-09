
import React, { useState } from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { GameSession } from "@/utils/gameStorage";

interface ShareButtonProps {
  session: GameSession;
  sessionId: string | undefined;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ session, sessionId }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    if (!session || !sessionId) return;
    
    // Create a challenge object with the necessary data
    const challengeData = {
      movies: session.movies.map(movie => movie.id),
      time: session.totalTime,
      playerNickname: session.playerNickname,
      playerAvatar: session.playerAvatar,
      sessionId: sessionId
    };
    
    // Use encodeURIComponent to handle special characters
    const encodedData = encodeURIComponent(JSON.stringify(challengeData));
    
    // Create share URL with proper encoding
    const shareUrl = `${window.location.origin}/challenge/${encodedData}`;
    
    // Copy to clipboard and show visual feedback
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        
        // Use sonner toast directly
        toast("Lien copié !", {
          description: "L'URL du défi a été copiée dans votre presse-papiers",
          position: "top-right",
          duration: 3000,
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de la copie:", error);
        toast.error("Impossible de copier", {
          description: "Veuillez copier l'URL manuellement",
          position: "top-right",
          duration: 3000,
        });
      });
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center text-[#E72F2F] text-[14px] font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Copié !
        </>
      ) : (
        <>
          <ClipboardCopy className="h-4 w-4 mr-1" />
          Partager le défi
        </>
      )}
    </button>
  );
};

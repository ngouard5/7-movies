
import React, { useState } from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameSession } from "@/utils/gameStorage";

interface ShareButtonProps {
  session: GameSession;
  sessionId: string | undefined;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ session, sessionId }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    if (!session || !sessionId) return;
    
    // Create a challenge object with the necessary data
    const challengeData = {
      movies: session.movies.map(movie => movie.id),
      time: session.totalTime,
      playerNickname: session.playerNickname,
      playerAvatar: session.playerAvatar,
      sessionId: sessionId // Important: Include the correct sessionId
    };
    
    // Encode the challenge data directly in the URL using base64
    const encodedData = btoa(JSON.stringify(challengeData));
    
    // Create share URL with the correct structure
    const shareUrl = `${window.location.origin}/challenge/${encodedData}`;
    
    // Copy to clipboard and show visual feedback
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        
        // Show toast notification
        toast({
          title: "Lien copié !",
          description: "L'URL du défi a été copiée dans votre presse-papiers"
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de la copie:", error);
        toast({
          title: "Impossible de copier",
          description: "Veuillez copier l'URL manuellement",
          variant: "destructive"
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

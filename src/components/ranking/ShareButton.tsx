
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
    
    // Remove any 'local-' prefix from the ID
    const cleanId = sessionId.replace(/^local-/, '');
    
    // Create the share URL
    const shareUrl = `${window.location.origin}/challenge/${cleanId}`;
    
    // Copy to clipboard and show visual feedback
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        
        toast("Link copied!", {
          description: "Challenge link has been copied to your clipboard",
          position: "top-right",
          duration: 3000,
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Couldn't copy link", {
          description: "Please copy the URL manually",
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
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopy className="h-4 w-4 mr-1" />
          Share Challenge
        </>
      )}
    </button>
  );
};

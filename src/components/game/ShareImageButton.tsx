import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Share, Check, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShareImageButtonProps {
  elementId: string;
  filename?: string;
  shareText?: string;
}

export const ShareImageButton: React.FC<ShareImageButtonProps> = ({
  elementId,
  filename = 'my-score.png',
  shareText = 'Check out my movie guessing score!'
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { t } = useLanguage();

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('Element not found');
        return;
      }

      // Generate screenshot
      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        filter: (node) => {
          // Exclude external images to prevent canvas tainting
          if (node.tagName === 'IMG') {
            const src = (node as HTMLImageElement).src;
            return !src.startsWith('http') || src.startsWith(window.location.origin);
          }
          return true;
        }
      });

      // Convert to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Try Web Share API first
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareText,
            files: [file]
          });
          setIsShared(true);
          setTimeout(() => setIsShared(false), 2000);
          return;
        }
      }

      // Fallback: Download the image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
      
    } catch (error) {
      console.error('Error sharing image:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center gap-2"
      variant="outline"
    >
      {isShared ? (
        <>
          <Check className="w-4 h-4" />
          {navigator.share ? 'Shared!' : 'Downloaded!'}
        </>
      ) : (
        <>
          {navigator.share ? <Share className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {isSharing ? 'Preparing...' : t('results.share.challenge')}
        </>
      )}
    </Button>
  );
};
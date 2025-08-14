import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, BookOpen } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CloseButton } from "./CloseButton";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  // Unmount after animation
  useEffect(() => {
    if (!isOpen && isClosing) {
      setIsClosing(false);
    }
  }, [isOpen, isClosing]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // match animation duration
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className={`relative w-full bg-neutral-50 h-full shadow-lg flex flex-col ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"}`}>
        <div className="p-4 flex justify-center items-center border-b border-gray-200 relative">
          <button 
            onClick={handleClose}
            className="absolute left-6 w-12 h-12 flex items-center justify-center text-[#E72F2F] hover:text-[#E72F2F]/80 transition-colors"
          >
            <CloseButton />
          </button>
          <div className="text-[32px]">🍿</div>
        </div>

        <div className="flex-1 py-6">
          <nav className="space-y-2">
            <NavItem 
              icon={<BookOpen className="text-[#E72F2F]" size={24} />} 
              label="How to play"
              onClick={() => handleNavigation('/how-to-play')}
            />
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          <PrimaryButton onClick={() => handleNavigation('/pre-game')}>
            Play now
          </PrimaryButton>
          
          <div className="text-center space-y-2">
            <div className="text-[14px] text-gray-600">
              7 movies is an after dinner project made with 🍿
            </div>
            <div className="text-[14px] text-gray-600">
              If you have suggestions please <a href="https://www.linkedin.com/in/nicolasgouard/" target="_blank" className="underline">contact me</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) => {
  return (
    <button 
      className="flex items-center w-full px-6 py-3 hover:bg-gray-100 transition-colors text-left"
      onClick={onClick}
    >
      <span className="mr-4">{icon}</span>
      <span className="text-[18px] font-semibold text-[#191919]">{label}</span>
    </button>
  );
};
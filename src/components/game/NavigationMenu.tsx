
import React from "react";
import { useNavigate } from "react-router-dom";
import { X, BookOpen } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      
      <div className="relative w-full bg-neutral-50 h-full shadow-lg flex flex-col animate-slide-in-right">
        <div className="p-6 flex justify-center items-center border-b border-gray-200 relative">
          <div className="text-[32px]">🍿</div>
          <button 
            onClick={onClose}
            className="absolute right-6 w-10 h-10 flex items-center justify-center text-[#E72F2F] hover:text-[#E72F2F]/80 transition-colors"
          >
            <X size={24} />
          </button>
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
            Start a new game
          </PrimaryButton>
          
          <div className="text-center space-y-2">
            <div className="text-[14px] text-gray-600">
              7 movies is an after dinner project made by Nicolas Gouard & codeconut
            </div>
            <div className="text-[14px] text-gray-600">
              If you have questions or suggestions please contact us!
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

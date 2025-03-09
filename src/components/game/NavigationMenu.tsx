
import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Play, BookOpen } from "lucide-react";

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
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative w-[290px] bg-white h-full animate-slide-in-left shadow-lg flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div className="text-[22px] font-bold text-[#191919]">Menu</div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E72F2F] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-6">
          <nav className="space-y-2">
            <NavItem 
              icon={<Play className="text-[#E72F2F]" size={24} />} 
              label="Play"
              onClick={() => handleNavigation('/pregame')}
            />
            <NavItem 
              icon={<BookOpen className="text-[#E72F2F]" size={24} />} 
              label="How to play"
              onClick={() => handleNavigation('/how-to-play')}
            />
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200 text-center">
          <div className="text-[16px] text-gray-500">
            Made with ❤️ by Lovable
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

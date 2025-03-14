"use client";

import { useAppContext } from "@/contexts/AppContext";
import { X, Play, BookOpen } from "lucide-react";

export function NavigationMenu() {
  const { menuOpen, setMenuOpen } = useAppContext();

  if (!menuOpen) return null;

  const closeMenu = () => setMenuOpen(false);

  const handleNavigation = (path: string) => {
    console.log(path);
    closeMenu();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={closeMenu} />

      <div className="relative w-[290px] bg-white h-full animate-slide-in-left shadow-lg flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div className="text-[22px] font-bold text-foreground">Menu</div>
          <button
            onClick={closeMenu}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E72F2F] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-6">
          <nav className="space-y-2">
            <NavItem
              icon={<Play className="text-[#E72F2F]" size={24} />}
              label="Play now"
              onClick={() => handleNavigation("/pre-game")}
            />
            <NavItem
              icon={<BookOpen className="text-[#E72F2F]" size={24} />}
              label="How to play"
              onClick={() => handleNavigation("/how-to-play")}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex items-center w-full px-6 py-3 hover:bg-gray-100 transition-colors text-left"
      onClick={onClick}
    >
      <span className="mr-4">{icon}</span>
      <span className="text-[18px] font-semibold text-foreground">{label}</span>
    </button>
  );
}

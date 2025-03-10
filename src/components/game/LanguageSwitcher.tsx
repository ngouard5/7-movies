
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
      aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
    >
      <span className="text-lg font-bold">{language === 'en' ? 'FR' : 'EN'}</span>
    </button>
  );
};

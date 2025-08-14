import React from "react";

interface HeaderLayoutProps {
  children: React.ReactNode;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({ 
  children, 
  leftButton, 
  rightButton 
}) => {
  return (
    <div className="flex flex-col min-h-[852px] bg-neutral-50">
      <header className="flex justify-between items-start pt-4 px-4 relative z-10 flex-shrink-0">
        <div className="w-12 h-12 flex justify-center items-center">
          {leftButton}
        </div>
        <div className="flex-1" />
        <div className="w-12 h-12 flex justify-center items-center">
          {rightButton}
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};
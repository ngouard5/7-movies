
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center md:p-4">
      <div className="w-full md:max-w-[393px] mx-auto">
        {children}
      </div>
    </div>
  );
};

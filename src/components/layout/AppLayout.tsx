import React from "react";
import { BackgroundBlobs } from "./BackgroundBlobs";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundBlobs />
      <div className="relative z-10 pb-16">
        {children}
      </div>
    </div>
  );
};
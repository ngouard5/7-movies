
import React from "react";
import { PhoneMockup } from "@/components/game/PhoneMockup";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Show content directly on mobile */}
      <div className="md:hidden w-full">
        {children}
      </div>
      
      {/* Show PhoneMockup on tablet/desktop */}
      <div className="hidden md:block">
        <PhoneMockup>
          {children}
        </PhoneMockup>
      </div>
    </>
  );
};

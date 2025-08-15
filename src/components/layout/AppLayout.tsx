import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen md:min-h-[600px] flex items-center justify-center md:p-4">
      <div className="pb-16 
        w-full mx-auto
        md:max-w-[600px]
        md:rounded-[24px]
        md:shadow-[0px_1px_4px_rgba(0,0,0,0.16)]
      ">
        {children}
      </div>
    </div>
  );
};

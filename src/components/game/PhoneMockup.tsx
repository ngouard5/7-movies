
import React from "react";

interface PhoneMockupProps {
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="relative w-[393px] h-[852px] bg-white rounded-[60px] shadow-xl overflow-hidden border-8 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-gray-800 rounded-b-xl z-10"></div>
        
        {/* Content */}
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};

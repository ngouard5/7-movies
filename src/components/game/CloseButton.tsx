
import { X } from "lucide-react";
import React from "react";

export const CloseButton = () => {
  return (
    <button
      className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
      aria-label="Close"
    >
      <X size={24} />
    </button>
  );
};

// components/BrochurePage.tsx
import React from "react";

interface BrochurePageProps {
  imageSrc: string;
  index: number;
}

const BrochurePage: React.FC<BrochurePageProps> = ({ imageSrc, index }) => {
  return (
    <div className="page bg-white w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={imageSrc}
        alt={`Page ${index + 1}`}
        className="max-w-full max-h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default BrochurePage;

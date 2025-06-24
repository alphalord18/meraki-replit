import React from "react";

interface BrochurePageProps {
  imageSrc: string;
  index: number;
}

// forwardRef is required for react-pageflip to work properly
const BrochurePage = React.forwardRef<HTMLDivElement, BrochurePageProps>(
  ({ imageSrc, index }, ref) => {
    return (
      <div ref={ref} className="page bg-white flex items-center justify-center">
        <img
          src={imageSrc}
          alt={`Page ${index + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  }
);

export default BrochurePage;

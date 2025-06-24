import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import BrochurePage from "@/components/BrochurePage";
import "pdfjs-dist/web/pdf_viewer.css";

// Set workerSrc manually
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const PDF_URL = "/meraki-brochure.pdf"; // PDF must be inside /client/public

const Brochure: React.FC = () => {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(PDF_URL).promise;
        const images: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          const imageData = canvas.toDataURL("image/png");
          images.push(imageData);
        }

        setPageImages(images);
      } catch (err) {
        console.error("Failed to load PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">
        Meraki 2025 Brochure Flipbook
      </h1>

      {loading ? (
        <p className="text-gray-300">Loading brochure...</p>
      ) : (
        <HTMLFlipBook
          width={500}
          height={700}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1536}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={false}
          flippingTime={0}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          clickEventForward={false}
          useMouseEvents={false}
          swipeDistance={0}
          showPageCorners={false}
          disableFlipByClick={false}
        >
          {pageImages.map((img, idx) => (
            <BrochurePage key={idx} imageSrc={img} index={idx} />
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
};

export default Brochure;

// pages/brochure.tsx
import React, { useEffect, useRef, useState } from "react";
import { FlipBook } from "page-flip";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const PDF_URL = "/meraki-brochure.pdf"; // Must be inside /public

const Brochure: React.FC = () => {
  const flipbookRef = useRef<HTMLDivElement>(null);
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
          const imgData = canvas.toDataURL();
          images.push(imgData);
        }

        if (flipbookRef.current) {
          const flipBook = new FlipBook(flipbookRef.current, {
            width: 500,
            height: 700,
            size: "stretch",
            drawShadow: true,
            flippingTime: 1000,
            showCover: true,
            usePortrait: false,
            mobileScrollSupport: true,
          });

          flipBook.loadFromImages(images);
        }
      } catch (err) {
        console.error("PDF load failed:", err);
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
        <div
          ref={flipbookRef}
          className="shadow-2xl rounded-xl overflow-hidden"
        />
      )}
    </div>
  );
};

export default Brochure;

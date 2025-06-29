import { pdfjsLib } from "@/lib/pdfWorker"; // ✅ Import configured pdfjs
import React, { useEffect, useRef, useState } from "react";
import { FlipBook } from "page-flip";

import "pdfjs-dist/web/pdf_viewer.css";

const PDF_URL = "/meraki-brochure.pdf"; // Must be in /public

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
          images.push(canvas.toDataURL());
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-24 px-4">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">
        Meraki 2025 Brochure Flipbook
      </h1>
      {loading ? (
        <p className="text-gray-300">Loading brochure...</p>
      ) : (
        <div ref={flipbookRef} className="shadow-2xl rounded-xl overflow-hidden" />
      )}
    </div>
  );
};

export default Brochure;

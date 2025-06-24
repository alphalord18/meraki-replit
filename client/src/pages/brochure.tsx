import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Set workerSrc for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDF_URL = "/meraki-brochure.pdf"; // Place your PDF in public/meraki-brochure.pdf

const Brochure: React.FC = () => {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      const pdf = await pdfjsLib.getDocument(PDF_URL).promise;
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL());
      }
      setPageImages(images);
      setLoading(false);
    };
    loadPdf();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">Meraki 2025 Brochure Flipbook</h1>
      {loading ? (
        <p className="text-gray-300">Loading brochure...</p>
      ) : (
        <HTMLFlipBook width={400} height={600} showCover={true} className="shadow-2xl">
          {pageImages.map((img, idx) => (
            <div key={idx} className="bg-white">
              <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
};

export default Brochure;
import * as pdfjsLib from "pdfjs-dist";

// ✅ Set workerSrc using a version that exists on cdnjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js`;

export { pdfjsLib };

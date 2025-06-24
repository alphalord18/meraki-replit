import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js?worker";

// Use local worker to avoid CDN errors
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

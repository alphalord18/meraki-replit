import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import worker from "pdfjs-dist/build/pdf.worker.js?worker";

pdfjsLib.GlobalWorkerOptions.workerPort = new worker();
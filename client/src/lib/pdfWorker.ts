import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/webpack"; // ← changed

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

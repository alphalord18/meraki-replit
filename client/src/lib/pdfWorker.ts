import { pdfjs } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new pdfWorker();

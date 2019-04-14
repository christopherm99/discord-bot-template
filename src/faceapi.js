import path from "path";
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from "canvas";

// implements window.fetch() in NodeJS
import fetch from "node-fetch";

// implements blobs in NodeJS
import Blob from "node-blob";
global.Blob = Blob;

import * as faceapi from "face-api.js";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

export default Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, "models")),
  faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, "models"))
]);

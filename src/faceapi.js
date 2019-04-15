import Blob from "node-blob";
import fetch from "node-fetch";
import path from "path";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
import "@tensorflow/tfjs-node";

global.Blob = Blob;

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

export default Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, "models")),
  faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, "models"))
]);

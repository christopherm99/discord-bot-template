import overlay from "./overlay.js";

export default [
  {
    name: "overlay",
    minArgs: 2,
    usage: `overlay <BACKDROP_URL> <OVERLAY_URL>
Finds all faces in backdrop image, and returns an image with faces overlaid.`,
    execute: overlay
  }
];

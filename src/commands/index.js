import clean from "./clean.js";
import overlay from "./overlay.js";
import yeet from "./yeet.js";

export default [
  {
    name: "clean",
    minArgs: 1,
    usage: `clean <IMAGE_URL>
Finds highest confidence face in an image, and returns a cropped and cleaned version of the image.`,
    execute: clean
  },
  {
    name: "yeet",
    minArgs: 2,
    usage: `yeet <BACKDROP_URL> <OVERLAY_URL>
Cleans overlay, finds all faces in backdrop image, and returns an image with faces overlaid.`,
    execute: yeet
  },
  {
    name: "overlay",
    minArgs: 2,
    usage: `overlay <BACKDROP_URL> <OVERLAY_URL>
Finds all faces in backdrop image, and returns an image with faces overlaid.`,
    execute: overlay
  }
];

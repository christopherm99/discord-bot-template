import * as faceapi from "face-api.js";
import { createCanvas, loadImage } from "canvas";
import Discord from "discord.js";

// Based on https://gist.github.com/remy/784508
function trim(c) {
  let ctx = c.getContext("2d"),
    copy = createCanvas(c.width, c.height).getContext("2d"),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x,
    y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~(i / 4 / c.width);

      if (bound.top) {
        bound.top = y;
      }

      if (bound.left) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  var trimHeight = bound.bottom - bound.top,
    trimWidth = bound.right - bound.left,
    trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // open new window with trimmed image:
  return copy.canvas;
}

export default {
  name: "clean",
  minArgs: 1,
  usage: `clean <IMAGE_URL>
Finds highest confidence face in an image, and returns a cropped and cleaned version of the image.`,
  execute(message, args) {
    console.log(`Cleaning image: ${args[0]}`);
    loadImage(args[0])
      .then(image => {
        faceapi
          .detectSingleFace(image)
          .withFaceLandmarks()
          .then(detection => {
            if (!detection.landmarks)
              message.channel.send("Could not find face");
            let canvas = createCanvas(image.width, image.height);
            let ctx = canvas.getContext("2d");
            // Draw clipping path to clean image
            ctx.beginPath();
            const jaw = detection.landmarks.getJawOutline();
            let crop_box = {
              top: Math.round(jaw[0].y),
              bottom: Math.round(jaw[0].y),
              left: Math.round(jaw[0].x),
              right: Math.round(jaw[0].x)
            };
            ctx.moveTo(jaw[0].x, jaw[0].y);
            jaw.slice(1).forEach(pt => {
              ctx.lineTo(pt.x, pt.y);
              if (pt.x < crop_box.top) {
                crop_box.top = Math.round(pt.x);
              } else if (pt.x > crop_box.bottom) {
                crop_box.bottom = Math.round(pt.x);
              }
              if (pt.y < crop_box.left) {
                crop_box.left = Math.round(pt.y);
              } else if (pt.y > crop_box.right) {
                crop_box.right = Math.round(pt.y);
              }
            });
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(image, 0, 0);
            message.channel.send(
              new Discord.Attachment(
                trim(canvas).createPNGStream(),
                "clean.png"
              )
            );
          })
          .catch(err => {
            console.error(err);
            message.channel.send("Couldn't detect face");
          });
      })
      .catch(error => {
        message.channel.send("Failed to parse image");
        console.error(error);
      });
  }
};

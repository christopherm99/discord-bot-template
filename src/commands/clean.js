import Discord from "discord.js";
import { createCanvas, loadImage } from "canvas";
import * as faceapi from "face-api.js";

// Based on https://gist.github.com/remy/784508
// eslint-disable-next-line sonarjs/cognitive-complexity
function trim(canvas) {
  const bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    copy = createCanvas(canvas.width, canvas.height).getContext("2d"),
    ctx = canvas.getContext("2d"),
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.round(i / 4 / canvas.width);

      if (!bound.top) {
        bound.top = y;
      }

      if (!bound.left) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (!bound.right) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (!bound.bottom) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  const trimHeight = bound.bottom - bound.top,
    trimWidth = bound.right - bound.left;
  const trimmed = ctx.getImageData(
    bound.left,
    bound.top,
    trimWidth,
    trimHeight
  );

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // open new window with trimmed image:
  return copy.canvas;
}

function clean(url) {
  return loadImage(url)
    .then(image =>
      faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .then(detection => {
          if (!detection) {
            return "Could not find face";
          }
          const canvas = createCanvas(image.width, image.height);
          const ctx = canvas.getContext("2d");

          // Draw clipping path to clean image
          ctx.beginPath();
          const jaw = detection.landmarks.getJawOutline();
          const cropBox = {
            top: Math.round(jaw[0].y),
            bottom: Math.round(jaw[0].y),
            left: Math.round(jaw[0].x),
            right: Math.round(jaw[0].x)
          };

          ctx.moveTo(jaw[0].x, jaw[0].y);
          jaw.slice(1).forEach(pt => {
            ctx.lineTo(pt.x, pt.y);
            if (pt.x < cropBox.top) {
              cropBox.top = Math.round(pt.x);
            } else if (pt.x > cropBox.bottom) {
              cropBox.bottom = Math.round(pt.x);
            }
            if (pt.y < cropBox.left) {
              cropBox.left = Math.round(pt.y);
            } else if (pt.y > cropBox.right) {
              cropBox.right = Math.round(pt.y);
            }
          });
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(image, 0, 0);

          return trim(canvas);
        })
        .catch(err => {
          console.error(err);

          return "Couldn't detect face";
        })
    )
    .catch(error => {
      console.error(error);

      return "Failed to parse image";
    });
}

export default function execute(message, args) {
  clean(args[0])
    .then(cleaned => {
      if (typeof cleaned === "string") {
        return cleaned;
      }
      message.channel.send(
        new Discord.Attachment(cleaned.createPNGStream(), "clean.png")
      );
    })
    .catch(err => {
      console.error(err);
      message.channel.send("Internal Error");
    });
}

export { clean };

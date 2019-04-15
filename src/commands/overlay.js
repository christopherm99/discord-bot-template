import Discord from "discord.js";
import { createCanvas, loadImage } from "canvas";
import * as faceapi from "face-api.js";

export default function execute(message, args) {
  loadImage(args[0])
    .then(backdrop => {
      faceapi
        .detectAllFaces(backdrop)
        .then(detections => {
          if (!detections[0]) {
            return "Could not find any faces";
          }
          loadImage(args[1])
            .then(overlay => {
              const canvas = createCanvas(backdrop.width, backdrop.height);
              const ctx = canvas.getContext("2d");

              ctx.drawImage(backdrop, 0, 0);
              detections.forEach(detection => {
                ctx.drawImage(
                  overlay,
                  detection.box.x,
                  detection.box.y,
                  detection.box.width,
                  detection.box.height
                );
              });
              message.channel.send(
                new Discord.Attachment(canvas.createPNGStream(), "overlay.png")
              );
            })
            .catch(err => {
              console.error(err);
              message.channel.send("Could not load image");
            });
        })
        .catch(err => {
          console.error(err);
          message.channel.send("Could not detect face");
        });
    })
    .catch(err => {
      console.error(err);
      message.channel.send("Could not load image");
    });
}

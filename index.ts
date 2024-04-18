import jimp from "jimp";
import { unlinkSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { Pixels } from "./pixel-edits";
import { scorpions } from "./metadata";

const LOGGING = false;
function log(message: string) {
  if (LOGGING) {
    console.log(message);
  }
}

function modify(filepath: string, fn: Function) {
  const type = "image/png";
  const buffer = readFileSync(filepath);
  const imageData = jimp.decoders[type](buffer);
  const image = new jimp(imageData);
  fn(image);
  writeFileSync(filepath, jimp.encoders[type](image));
}

function withImage(filename: string) {
  const filePath = join(__dirname, "abandoned_scorpions", filename);
  const tmpFilepath = join(__dirname, "tmp", filename);
  const outputFilepath = join(__dirname, "output", filename);
  log(`Copying ${filename} -> tmp/${filename}`);
  copyFileSync(filePath, tmpFilepath);

  const fileOperations = {
    do: function (fn: Function) {
      log("Modifying image");
      modify(tmpFilepath, fn);
      return fileOperations;
    },
    done: function () {
      copyFileSync(tmpFilepath, outputFilepath);
      log(`Saving image to output/${filename}`);
      unlinkSync(tmpFilepath);
      log(`Deleting tmp/${filename}`);
    },
  };

  return fileOperations;
}

function setPixel(image: jimp, x: number, y: number, color: number) {
  image.setPixelColor(color, x, y);
}

function setPixelsTransparent(pixels: number[][]) {
  return function (image: jimp) {
    pixels.forEach(([x, y]) => setPixel(image, x, y, 0xff0000));
  };
}

function cropRightColumns(cols: number) {
  return function (image: jimp) {
    //image.crop(0, 0, image.getWidth() - cols, image.getHeight());
  };
}

function cropLeftColumns(cols: number) {
  return function (image: jimp) {
    //image.crop(cols, 0, image.getWidth() - cols, image.getHeight());
  };
}

function setColumnTransparent(image: jimp, x: number, color: number) {
  for (let y = 0; y < image.getHeight(); y++) {
    setPixel(image, x, y, color);
  }
}

function setBlockTransparent(image: jimp, x1: number, y1: number, x2: number, y2: number) {
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      setPixel(image, x, y, 0xff0000);
    }
  }
}

const startTime = performance.now();

for (let i = 0; i <= 9999; i++) {
  let id = i.toString().padStart(4, "0");

  const has_matches = scorpions.has_matches["true"].has(id);
  const has_cigarette = scorpions.has_cigarette["true"].has(id);

  withImage(`${id}.png`)
    .do((image: jimp) => {
      const pixels: number[][] = [];

      // legs
      {
        if (scorpions.legs.normal.has(id)) {
          pixels.push(...Pixels.legs.normal);
        }
        if (scorpions.legs.skinny.has(id)) {
          pixels.push(...Pixels.legs.skinny);
        }

        if (scorpions.legs.insect.has(id)) {
          pixels.push(...Pixels.legs.insect);
        }

        if (scorpions.legs.stubby.has(id)) {
          pixels.push(...Pixels.legs.stubby);
        }

        pixels.push(...Pixels.legs.common);
      }

      // tail
      {
        if (scorpions.tail.normal.has(id)) {
          setBlockTransparent(image, 25, 0, 31, 31);
          pixels.push(...Pixels.tail.normal);
        }
        if (scorpions.tail.syringe.has(id)) {
          setBlockTransparent(image, 26, 0, 31, 31);
          pixels.push(...Pixels.tail.syringe);
        }
        if (scorpions.tail.fat.has(id)) {
          setBlockTransparent(image, 27, 0, 31, 31);
          pixels.push(...Pixels.tail.fat);
        }
        if (scorpions.tail.ball.has(id)) {
          setBlockTransparent(image, 25, 0, 31, 31);
          pixels.push(...Pixels.tail.ball);
        }
        if (scorpions.tail.missing.has(id)) {
          setBlockTransparent(image, 25, 0, 31, 31);
          pixels.push(...Pixels.tail.missing);
        }
      }

      // claws left
      {
        if (scorpions.claw_left.regular.has(id)) {
          setBlockTransparent(image, 0, 0, 5, 31);
          setBlockTransparent(image, 0, 0, 14, 5); // above claw
          pixels.push(...Pixels.claw_left.regular(has_matches, has_cigarette));
        }
        if (scorpions.claw_left.big.has(id)) {
          setBlockTransparent(image, 0, 0, 4, 31);
          pixels.push(...Pixels.claw_left.big);
        }
        if (scorpions.claw_left.ball.has(id)) {
          setBlockTransparent(image, 0, 0, 6, 31);
          pixels.push(...Pixels.claw_left.ball);
        }
        if (scorpions.claw_left.mushroom.has(id)) {
          setBlockTransparent(image, 0, 0, 5, 31);
          setBlockTransparent(image, 6, 0, 24, 5);
          pixels.push(...Pixels.claw_left.mushroom);
        }
        if (scorpions.claw_left.scissors.has(id)) {
          setBlockTransparent(image, 0, 0, 4, 31); // left of claw
          setBlockTransparent(image, 0, 0, 14, 5); // above claw
          pixels.push(...Pixels.claw_left.scissors);
        }
        if (scorpions.claw_left.missing.has(id)) {
          setBlockTransparent(image, 0, 0, 6, 31);
          pixels.push(...Pixels.claw_left.missing);
        }
      }

      // claws right
      {
        if (scorpions.claw_right.regular.has(id)) {
          pixels.push(...Pixels.claw_right.regular(has_matches, has_cigarette));
        }
        if (scorpions.claw_right.big.has(id)) {
          pixels.push(...Pixels.claw_right.big);
        }
        if (scorpions.claw_right.ball.has(id)) {
          pixels.push(...Pixels.claw_right.ball);
        }
        if (scorpions.claw_right.mushroom.has(id)) {
          pixels.push(...Pixels.claw_right.mushroom);
        }
        if (scorpions.claw_right.scissors.has(id)) {
          pixels.push(...Pixels.claw_right.scissors);
          setBlockTransparent(image, 0, 0, 31, 5); // above claw
        }
        if (scorpions.claw_right.missing.has(id)) {
          pixels.push(...Pixels.claw_right.missing);
        }
      }

      setPixelsTransparent(pixels)(image);

      if (scorpions.has_halo.true.has(id)) {
        // Draw halo, should be done last since previous operations removed it
        Pixels.halo.forEach(([x, y]) => setPixel(image, x, y, 0xffe495ff));
      }
      if (scorpions.has_matches.true.has(id)) {
        image.setPixelColor(0xba9b7bff, 6, 8); // we may have clipped off the tip of the match stick
      }
      if (scorpions.has_cigarette.true.has(id)) {
        // we may have clipped off the tip of the cigarette
        // tip
        image.setPixelColor(0x000000ff, 25, 7);
        image.setPixelColor(0xff0000ff, 25, 8);
        image.setPixelColor(0x000000ff, 25, 9);
        // smoke
        image.setPixelColor(0x757575ff, 26, 8);
        image.setPixelColor(0x757575ff, 26, 7);
        image.setPixelColor(0x757575ff, 26, 6);
        image.setPixelColor(0x757575ff, 25, 5);
        image.setPixelColor(0x757575ff, 24, 5);
        image.setPixelColor(0x757575ff, 23, 4);
      }
    })
    .done();
}

const endTime = performance.now();
console.log(`Process took ${((endTime - startTime) / 1000).toFixed(4)}s`);

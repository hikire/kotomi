const Jimp = require("jimp");
const { rename } = require("./fs");

async function resize({ imagePath, cachePath, width }) {
  try {
    const image = await Jimp.read(imagePath);
    await image.resize(width, Jimp.AUTO).writeAsync(cachePath + ".writing");
    await rename(cachePath + ".writing", cachePath);
    process.send({ imagePath, cachePath });
  } catch (error) {
    process.send({
      imagePath,
      cachePath,
      error
    });
  }
}

process.on("message", resize);

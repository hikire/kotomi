const carlo = require("carlo");
const wallpaper = require("wallpaper");
const path = require("path");
const { lstat, readdir, ensureDir, readFile, rename } = require("./fs");
const resizeAndSave = require("./resizeWorker");

const CACHE_PATH =
  process.env.WALLS_CACHE_DIR || path.join(process.env.HOME, ".kotomi/cache");

const EXTENTIONS = [".png", ".jpg"];

let includeScreenshots, width, cpus;

const isIgnored = fileName =>
  !includeScreenshots && fileName.startsWith("Screenshot");

const resizingPromises = new Map();

async function main(options) {
  const { folder } = options;
  includeScreenshots = options.includeScreenshots;
  width = options.width;
  cpus = options.cpus;
  const app = await carlo.launch({
    width,
    title: "Kotomi",
    top: 0,
    left: 0,
    bgcolor: "#A0A0A0"
  });
  app.on("exit", () => process.exit());
  await app.serveFolder(__dirname);
  await app.serveFolder(path.dirname(require.resolve("lozad")), "lozad");

  await app.exposeFunction("getPictures", async () => {
    try {
      return await getPictures(folder);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      console.error(`Folder was not found: ${folder}`);
      process.exit(-1);
    }
  });

  app.serveHandler(async request => {
    const imageName = decodeURIComponent(path.basename(request.url()));

    if (!request.url().startsWith("https://domain/picture/"))
      return request.continue();
    if (EXTENTIONS.indexOf(path.extname(imageName)) === -1)
      return request.continue();

    try {
      const cachedImage = await getCachedImage(folder, imageName);
      request.fulfill({ body: cachedImage });
    } catch (error) {
      console.error("Error :(,\n", error);
      request.abort();
    }
  });

  await app.exposeFunction("setWallpaper", pic =>
    wallpaper.set(path.join(folder, pic))
  );
  await app.load("index.html");
}

async function getPictures(folder) {
  const items = await readdir(folder);
  let pictures = [];
  if (items.length) {
    for (let item of items) {
      const filePath = path.join(folder, item);
      const stats = await lstat(filePath);
      const isDirectory = stats.isDirectory();
      const isExtentionAccepted = EXTENTIONS.indexOf(path.extname(item)) !== -1;
      const fileName = path.basename(item);
      if (!isDirectory && isExtentionAccepted && !isIgnored(fileName))
        pictures.push([stats.mtimeMs, fileName]);
    }
  }
  return pictures.sort((a, b) => b[0] - a[0]).map(([_, name]) => name);
}

async function getCachedImage(folder, imageName) {
  const originalPath = path.join(folder, imageName);
  const { dir, name, ext } = path.parse(originalPath);
  const cachedPath = path.join(CACHE_PATH, dir, `${name}-${width}${ext}`);
  await ensureDir(path.dirname(cachedPath));
  try {
    const orginalStats = await lstat(originalPath);
    const cacheStats = await lstat(cachedPath);
    if (orginalStats.mtimeMs > cacheStats.mtimeMs) throw new Error("out dated");
  } catch (error) {
    if (error.code === "ENOENT" && error.path !== cachedPath)
      throw new Error("Original picture was not found");
    const cachedImageExists = error.code !== "ENOENT";
    const cacheOutdated = error.message === "out dated";
    if (cachedImageExists && !cacheOutdated) throw error;
    await cacheImage(originalPath, cachedPath);
  }
  return await readFile(cachedPath);
}

async function cacheImage(imagePath, cachePath) {
  if (!resizingPromises.has(imagePath))
    resizingPromises.set(
      imagePath,
      resizeAndSave(imagePath, cachePath, width, cpus)
    );
  await resizingPromises.get(imagePath);
  resizingPromises.delete(imagePath);
}

module.exports = main;

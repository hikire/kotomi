const PRELOAD = 6;
const images = new Map();
const imageElements = new Map();
let pictureList = [];

async function run() {
  try {
    pictureList = await getPictures();
    const elements = pictureList.map(createImageElement);
    document.body.append(...elements);
    const observer = lozad(".lozad", {
      load: function(element) {
        const current = element.getAttribute("data-src");
        const currentIndex = pictureList.indexOf(current);
        if (currentIndex === -1) throw new Error("Picture was not found");
        const preloadEndIndex = Math.min(
          currentIndex + PRELOAD,
          pictureList.length
        );
        for (let i = currentIndex; i < preloadEndIndex; i++)
          showImage(pictureList[i]);
      }
    });
    observer.observe();
  } catch (error) {
    console.error(error);
  }
}

function createImageElement(pic) {
  const element = document.createElement("img");
  element.setAttribute("data-src", pic);
  element.className = "lozad";
  element.addEventListener("click", set.bind(null, pic));
  imageElements.set(pic, element);
  return element;
}

async function set(pic) {
  console.log("setting", pic);
  await setWallpaper(pic);
}

async function showImage(pic) {
  const element = imageElements.get(pic);
  if (!element) throw new Error("Element was not found");
  if (element.src) return;
  element.src = (await getImage(pic)).src;
}

async function getImage(pic) {
  if (!images.has(pic)) images.set(pic, loadImage(pic));
  return await images.get(pic);
}

async function loadImage(pic) {
  const image = new Image();
  image.src = `picture/${pic}`;
  const imageLoaded = new Promise(res => {
    image.onload = () => res(image);
  });
  return await imageLoaded;
}

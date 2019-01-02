const os = require("os");
const childProcess = require("child_process");
const path = require("path");

let forksLimit = Math.min(3, os.cpus().length);
let forks = 0;
const tasks = [];

function resizeAndSave(imagePath, cachePath, width, maxForks = forksLimit) {
  forksLimit = maxForks;
  return new Promise((resolve, reject) => {
    tasks.unshift({ imagePath, cachePath, width, resolve, reject });
    createForkIfPossible();
  });
}

async function createForkIfPossible() {
  if (!tasks.length) return;
  if (forks < forksLimit) createFork(tasks.pop());
}

function createFork({ imagePath, cachePath, width, resolve, reject }) {
  const fork = childProcess.fork(path.join(__dirname, "/resizeProcess.js"));
  forks++;
  fork.on("message", handleResult.bind({ fork, resolve, reject }));
  fork.on("error", error => console.error("P:", error));
  fork.send({ imagePath, cachePath, width });
}

function handleResult({ error }) {
  if (error) this.reject(error);
  else this.resolve();
  // create a new one instead of reusing to reduce memory consumption
  this.fork.kill();
  forks--;
  createForkIfPossible();
}

module.exports = resizeAndSave;

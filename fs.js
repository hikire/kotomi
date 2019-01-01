const { readdir, lstat, mkdir, readFile, rename } = require("fs");
const { promisify } = require("util");

const fs = {
  readdir: promisify(readdir),
  lstat: promisify(lstat),
  mkdir: promisify(mkdir),
  readFile: promisify(readFile),
  rename: promisify(rename)
};

fs.ensureDir = async dir => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
};

module.exports = fs;

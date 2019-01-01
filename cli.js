#!/usr/bin/env node

const main = require("./index");
const path = require("path");
const meow = require("meow");

const cli = meow(
  `
	Usage
	  $ kotomi [dir]

	Options
    --width=<integer>, --w=<integer> Set thumbnail and window width, default: 420
    --include-screenshots, --isInclude files starting with "Screenshot"
    --cpus=<integer>, --c=<integer>  Limit max number of subprocesses for resizing images, default: 3
    --help Displays help
    --version Displays the app version
  Config
  Optional customizations.
    WALLS_DIR: Pictures path to use when dir isn't provided, default = \$HOME/Pictures
    WALLS_CACHE_DIR: thumbnails cache path, default = \$HOME/.kotomi/cache

  Examples
    $ kotomi --w=600
    // Opens $HOME/Pictures (or $WALLS_DIR), with window width 600 and thumbnails resized to fit this width
    $ kotomi --is
    // Opens $HOME/Pictures (or $WALLS_DIR), and includes shortcuts
    $ kotomi .
    // Opens the current dir
`,
  {
    flags: {
      width: {
        type: "string",
        alias: "w",
        default: "420"
      },
      includeScreenshots: {
        type: "boolean",
        alias: "is"
      },
      cpus: {
        type: "string",
        alias: "c",
        default: "3"
      }
    }
  }
);

const WALLS_DIR =
  process.env.WALLS_DIR || path.join(process.env.HOME, "Pictures");

function getPicturesFolder(inputPath) {
  if (!inputPath) return WALLS_DIR;
  if (path.isAbsolute(inputPath)) return inputPath;
  return path.join(process.cwd(), inputPath);
}

const { width, includeScreenshots, cpus } = cli.flags;
main({
  folder: getPicturesFolder(cli.input[0]),
  width: parseInt(width),
  includeScreenshots,
  cpus: parseInt(cpus)
}).catch(error => {
  console.error(error);
  process.exit(-1);
});

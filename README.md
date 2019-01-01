# Kotomi

Change wallpapers peacefully (You will know what I mean if you use gnome-settings to change it regularlly when having tons of large wallpapers).

Kotomi lazy loads and caches a smaller version of your wallpapers in `WALLS_CACHE_DIR` to show as thumbnails when selecting the wallpaper so it can load them faster next time you change the wallpaper (this doesn't affect the original wallpaper which is used when you click to set a wallpaper).

![screenshot from 2019-01-01 02-18-23](https://user-images.githubusercontent.com/39221661/50569359-cfc58180-0d6b-11e9-9c3a-57313529c2e1.png)

## Installation

For now there is no binaries, in the meantime you can install kotomi using npm/yarn.

```sh
# For npm users
npm i -g kotomi-chan
# For yarn users
yarn global add kotomi-chan
```

## Requirements

This app depends on [carlo](https://github.com/GoogleChromeLabs/carlo), so you need to have chrome/chromium(70.\*+) installed.

Kotomi has been tested only on linux. But it should work on Mac OS and Windows as long as the config is valid.

## Usage

```sh
$ kotomi [dir]
```

#### Please note that the first time kotomi loads a picture can be slow due to creating thumbnails, naturally it'll be faster the next time you use it.

### Options

- --width=<integer>, --w=<integer> Set thumbnail and window width, default: 420
- --include-screenshots, --is Include files starting with "Screenshot"
- --cpus=<integer>, --c=<integer> Limit max number of subprocesses for resizing images, default: 3
- --help Displays help
- --version Displays the app version

### Config

Optional customizations.

- WALLS_DIR: Pictures path to use when dir isn't provided, default = \$HOME/Pictures
- WALLS_CACHE_DIR: thumbnails cache path, default = \$HOME/.kotomi/cache

### Examples

```sh
$ kotomi --w=600
// Opens $HOME/Pictures (or $WALLS_DIR), with window width 600 and thumbnails resized to fit this width
$ kotomi --is
// Opens $HOME/Pictures (or $WALLS_DIR), and includes shortcuts
$ kotomi .
// Opens the current dir
```

## Contributing

1. Fork it!
2. Create your feature branch (`git checkout -b my-cool-feature`)
3. Commit your changes (`git commit -am 'add my feature'`)
4. Push to the branch (`git push origin my-cool-feature`)
5. Create a new Pull Request

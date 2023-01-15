# NDawn

NDwan is Next Dawn for personal customized TryGhost official theme Dawn.

## Preview of NDawn
![preview](./docs/2023-01-15-19.55.47-720p.mp4)

## Features of NDawn
### 1. clickable menubar
The theme looks for a menu item with three dots (`...`) in its URL, and uses that as a dropdown menu toggle. All menu items after the toggle will be added to the dropdown list automatically.

| Label      | URL                       |
|------------|---------------------------|
| More links | https://example.com/...   |
| Sub-1      | https://example.com/sub-1 |
| Sub-2      | https://example.com/sub-2 |

### 2. dark/light theme change button

## Development env setup

For quickly seting up NDawn development environment, I will introduce the utils for quickly startup
with one short cmdline.

### usage
1. run `make env` cmdline to setup development environment.
2. run `make startup` to setup environment and yarn developement envrionment

### details
You can check `Makefile` for more details about commands to do the setting up thing.

## Dawn(Origin README of Dawn)

A highly functional theme that adapts to the reader's preferences. Let them read, search, subscribe, navigate, and more with ease. Completely free and fully responsive, released under the MIT license.

**Demo: https://dawn.ghost.io**


### Instructions

1. [Download this theme](https://github.com/TryGhost/Dawn/archive/main.zip)
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

### Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
yarn

# Run build & watch for changes
$ yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
yarn zip
```

### PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.

### Copyright & License

Copyright (c) 2013-2022 Ghost Foundation - Released under the [MIT license](LICENSE).

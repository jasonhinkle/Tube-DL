# Tube-DL

Download videos from many of the most popular video streaming sites. Tube-DL is a simplified UI for the excellent command-line application [youtube-dl](https://rg3.github.io/youtube-dl/).

![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/assets/images/screenshot-1.png)
![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/assets/images/screenshot-2.png)

# How To Use Tube-DL

Download a pre-built installer from the [Releases](https://github.com/jasonhinkle/Tube-DL/releases) page.

1. Run `Tube DL`
2. Enter or paste the URL of YouTube, Vimeo, etc page into the URL field.
3. Select whether you want the video file or audio only.
4. Click the Download button
5. Finder/Explorer will open to the folder where the file was downloaded

# Building From Source

*The project is written in Javascript running in [node](https://nodejs.org/) and packaged for the desktop using [Electron](http://electron.atom.io/). Ensure that Node and NPM are installed and configured on the development machine.*

#### Install the required electron builder tools:

*I recommend installing the electron libraries globally, however installing them locally is fine.*

```
npm install electron-prebuilt -g
npm install electron-packager -g
```

Optionally to create OSX and Win32 installers:
```
npm install electron-osx-sign -g
npm install electron-builder -g
```

#### Install the application's dependencies:

```
cd "Tube DL"
npm install
```

#### Run Tube DL in debug/test mode:

```
npm start
```

#### Build a stand-alone executable

*Use osx or win build depending on your platform.*

```
npm run build:osx
npm run build:win
```

## Credits

The following libraries and executables are used by Tube DL:

* [youtube-dl](https://github.com/rg3/youtube-dl)
* [ffmpeg for Win32](http://ffmpeg.zeranoe.com/builds/)
* [ffmpeg for OSX](https://evermeet.cx/ffmpeg/)

## License

GPL-3.0 License is required with inclusion of ffmpeg (used only for audio conversion). If you remove ffmpeg, the remaining code may be distributed under the terms of the MIT.

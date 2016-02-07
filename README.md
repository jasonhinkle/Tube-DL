# Tube-DL

Download videos from many of the most popular video streaming sites. Tube-DL is a simplified UI for the excellent command-line application [youtube-dl](https://rg3.github.io/youtube-dl/).

![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/screenshot-1.png)
![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/screenshot-2.png)

# Usage

1. Open Tube DL executable
2. Paste the URL of the page with the Video.
3. Select desired video or audio format
4. Click the Download button
5. The file will be saved to your desktop

# Building From Source

*The project is written in Javascript running in a node environment and packaged for the desktop using Electron.*

1. Ensure node and npm are installed and properly configured
2. At the command line run `npm install`
3. To start in debug mode run `npm start`
4. To build and package run `npm run build`

## Libraries and Components Used

* [youtube-dl](https://github.com/rg3/youtube-dl)
* [ffmpeg for Win32](http://ffmpeg.zeranoe.com/builds/)
* [ffmpeg for OSX](https://evermeet.cx/ffmpeg/)

## License

GPL License is required with inclusion of ffmpeg (used only for audio conversion). If you remove ffmpeg, the remaining code may be distributed under the terms of the MIT.
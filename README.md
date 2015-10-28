# Tube-DL

Download videos from many of the most popular video streaming sites. Tube-DL is a simplified UI for the excellent command-line application [youtube-dl](https://rg3.github.io/youtube-dl/).

![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/screenshot.png)

# Usage

1. Open Tube DL executable
2. Paste the URL of the page with the Video.
3. Select desired video or audio format
4. Click the Download button
5. The file will be saved to your desktop

# Building From Source

*The project is an Adobe AIR application and is easiest to build using Adobe Flash Builder 4.6 or higher. It may be possible to build it without Flash Builder. If you do, please send me your steps (or a pull request) and I'll include the instructions for everyone.*

1. Ensure [Apache Flex](http://flex.apache.org/) version 4.14.1 or higher is installed
2. Open project in Adobe Flash Builder
3. In project properties, double check that 4.14.1 is configured as the Flex compiler
4. Run or Debug as an AIR Desktop Application

## Libraries and Components Used

* [Flat Spark](https://cwiki.apache.org/confluence/display/FLEX/Using+FlatSpark+skins)
* [youtube-dl](https://github.com/rg3/youtube-dl)
* [ffmpeg for Win32](http://ffmpeg.zeranoe.com/builds/)
* [ffmpeg for OSX](https://evermeet.cx/ffmpeg/)

## License

GPL License is required with inclusion of ffmpeg (used only for audio conversion). If you remove ffmpeg, the remaining code may be distributed under the terms of the LGPL.
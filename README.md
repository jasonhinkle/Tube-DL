# Tube-DL

Download videos from many of the most popular video streaming sites. Tube-DL is a simplified UI for the excellent command-line application youtube-dl.

![Screenshot](https://raw.github.com/jasonhinkle/Tube-DL/master/screenshot.png)

# Building

* Ensure Apache Flex version 4.14.1 or higher is installed
* Open project in Adobe Flash Builder
* In project properties, double check that 4.14.1 is configured as the Flex compiler
* Run or Debug as an AIR Desktop Application

# Usage

1. Open Tube DL executable
2. Paste the URL of the page with the Video.
3. Select desired video or audio format
4. Click the Download button
5. The file will be saved to your desktop

## Libraries and Components Used

* https://cwiki.apache.org/confluence/display/FLEX/Using+FlatSpark+skins
* https://github.com/rg3/youtube-dl
* http://ffmpeg.zeranoe.com/builds/
* https://evermeet.cx/ffmpeg/

## License

GPL License is required with inclusion of ffmpeg (used only for audio conversion). If you remove ffmpeg, the remaining code may be distributed under the terms of the LGPL.
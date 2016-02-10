/**
 * main.js contains the main application logic and is instantiated
 * by index.html
 */

// local libraries
const ui = require('./app/ui.js');
const util = require('./app/util.js');

// system libraries
const package = require('./package.json')
const fs = require('fs');
const newProcess = require('child_process').spawn;

// file paths
const downloaderPath = __dirname + '/assets/bin/osx/youtube-dl';
const converterPath = __dirname + '/assets/bin/osx/ffmpeg';
const outputDirectory = util.getDownloadsDirectory() + 'Tube DL/';

// application state
var videoFileName;
var videoFileLength;
var audioFileName;
var cancelRequested = false;
var currentVideoNumber = 1;
var totalNumberOfVideos = 1;
var startingNewFile = true;
var downloadedVideos = [];

// debug - open modal on launch
// $('#download-modal').modal();

$("#version").html(package.version);

// download button click handler
$('#download-btn').on('click',function(e){
  e.preventDefault();
  onDownloadClick();
});

// cancel button notifies any process that cares
$('#cancel-btn').on('click',function(e){
  e.preventDefault();
  cancelRequested = true;
});

/**
 * Reset the UI to all defaults, ready for a new download operation
 */
function resetState() {
  videoFileName = '';
  videoFileLength = '';
  audioFileName = '';
  cancelRequested = false;
  currentVideoNumber = 1;
  totalNumberOfVideos = 1;
  startingNewFile = true;
  downloadedVideos = [];

  ui.clear();
  ui.setProgress(0);
  ui.warn('');
  cancelRequested = false;
}

/**
 * Download button click handler
 */
function onDownloadClick() {

  // make sure our Tube DL subdirectory exists
  util.makeDirectory(outputDirectory);

  resetState();

  var url = ui.getVideoURL();
  if (url == '') {
    alert('Video URL is required');
    return;
  }
  else if (url.indexOf(' ') > -1) {
    alert('Invalid Video URL');
    return;
  }

  ui.out("Starting download...");
  ui.showModal();
  downloadVideo();
}

/**
 * Clean up the downloaded video and audio files
 * @param bool true to delete video (default = true)
 * @param bool true to delete audio (default = false)
 */
function cleanupFiles(deleteVideo, deleteAudio)
{

  if (typeof deleteVideo === "undefined") deleteVideo = true;
  if (typeof deleteAudio === "undefined") deleteAudio = false;

  if (deleteVideo) {
    var files = fs.readdirSync(outputDirectory);
    for (var i in files) {
      var fileName = files[i].toString();
      if (fileName == videoFileName || fileName.substr(0,fileName.length+5) == videoFileName+'.part' ) {
        fs.unlink(outputDirectory + fileName);
        ui.out('Cleaned up video file ' + fileName,'info');
      }
    }
  }

  if (deleteAudio) {
    if (fs.existsSync(outputDirectory + audioFileName)) {
      fs.unlink(outputDirectory + audioFileName);
    }
  }

}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DOWNLOAD THE VIDEO FILE TO outputDirectory
 * @see https://github.com/rg3/youtube-dl/blob/master/README.md
 */
function downloadVideo() {

  ui.setStatus(ui.STATUS_PENDING);

  var downloader = newProcess(downloaderPath, [
      '--ignore-config',
      ui.getVideoURL()
  ],{
    'cwd': outputDirectory
  });

  downloader.stdout.on('data', function(chunk) {

      if (cancelRequested) {
        downloader.kill('SIGTERM');
      }

      // since the operation is asyncronous each output chunk from the
      // shell command may contain more than one line of output. we can normalize
      // the line breaks and split them to process each line of output separately
      var lines = chunk.toString().trim().replace(/\r/g,'\n').split('\n');

      for (var key in lines) {

        var line = lines[key];
        ui.out(line, 'muted');

        // [download] Downloading video 1 of 5
        if (line.indexOf('] Downloading video') > -1 && line.indexOf(' of ') > -1) {
          currentVideoNumber = parseInt(util.getTextBetween(line,'Downloading video ',' of').trim());
          totalNumberOfVideos = parseInt(util.getTextBetween(line,' of ').trim());
          startingNewFile = true;
          ui.setStatus(ui.STATUS_DOWNLOADING_PENDING,'Downloading video ' + currentVideoNumber + ' of ' + totalNumberOfVideos);
        }

        // [download] Destination: Missing-UiyDmqO59QE.f137.mp4
        if (line.indexOf('] Destination:') > -1) {
          videoFileName = util.getTextBetween(line,'] Destination:').trim();

          // the first file we see will be video.  the second file will be audio
          if (startingNewFile) {
            startingNewFile = false;
            ui.setStatus(ui.STATUS_DOWNLOADING_VIDEO);
          }
          else {
            ui.setStatus(ui.STATUS_DOWNLOADING_AUDIO);
          }

          ui.out('Downloading ' + videoFileName, 'info');
        }

        // [ffmpeg] Merging formats into "Missing-UiyDmqO59QE.mp4"
        if (line.indexOf('Merging formats into ') > -1) {
          videoFileName = util.getTextBetween(line,'Merging formats into "','"').trim();
          ui.setStatus(ui.STATUS_MUXING);
          ui.out('Merging files into ' + videoFileName, 'info');

          downloadedVideos.push(videoFileName);

        }

        if (line.indexOf('has already been downloaded') > -1) {
          videoFileName = util.getTextBetween(line,'[download] ','has already been downloaded').trim();
          ui.setStatus(ui.STATUS_MUXING); // technically it is already muxed, so we skip the UI ahead to this status
          ui.out('Video ' + videoFileName + ' already downloaded', 'info');

          downloadedVideos.push(videoFileName);
        }

        // [DashSegments] f626Bl2WZt8: Downloading segment 1 / 43
        if (line.indexOf('Downloading segment') > -1) {
          var formula = util.getTextBetween(line,'Downloading segment ').trim();
          var segment = parseInt( util.getTextBetween(formula,'',' /').trim() );
          var total = parseInt( util.getTextBetween(formula,' / ').trim() );
          var percent = Math.round(100 * 100 * segment/total) / 100;
          ui.setProgress( parseFloat(percent) );
        }

        // [download] 25.0% of 251.77KiB at 607.42KiB/s ETA 00:00
        if (line.substr(0,10) == '[download]' && line.indexOf('ETA') > -1) {
          var percent = util.getTextBetween(line,'[download] ','%').trim();
          ui.setProgress( parseFloat(percent) );
        }

      }

  });

  downloader.stderr.on("data", function (data) {

    if (cancelRequested) {
      downloader.kill('SIGTERM');
    }

    // chunk may include more than line of output at a time
    var lines = data.toString().trim().replace(/\r/g,'\n').split('\n');

    for (var key in lines) {
      var line = lines[key];
      ui.out(line, 'danger');

      // WARNING: Requested formats are incompatible for merge and will be merged into mkv.
      // ERROR: irLFyZiWTRw: YouTube said: Please sign in to view this video.
      if (line.substr(0,5) == 'ERROR') {
        ui.warn(line);
      }

    }

  });

  downloader.on('close', function (code, signal) {
    // do nothing
  });

  downloader.on('exit', function (code, signal) {

    if (cancelRequested) {
      ui.setStatus(ui.STATUS_DONE);
      ui.out('Download cancelled', 'danger');
      ui.setProgress(100);
      ui.warn('Download Cancelled');
      cleanupFiles();
    }
    else if (ui.getDownloadFormat() == 'Video') {
      ui.setStatus(ui.STATUS_DONE);
      ui.out('Downloaded ' + videoFileName + ' to ' + outputDirectory, 'success');
      ui.setProgress(100);

      util.openFolder(outputDirectory);
    }
    else {
      ui.out('Downloaded ' + videoFileName + ' to ' + outputDirectory, 'success');
      ui.setProgress(100);

      // if no videos appear to have downloaded, then it means the file was pre-muxed from YouTube
      if (downloadedVideos.length == 0) downloadedVideos.push(videoFileName);

      currentVideoNumber = 1;
      convertToMp3();
    }


  });
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CONVERT THE DOWNLOADED VIDEO FILE TO AN MP3
 * @see https://trac.ffmpeg.org/wiki/Encode/MP3
 */
function convertToMp3() {

  ui.setStatus(ui.STATUS_CONVERTING);

  if (currentVideoNumber > downloadedVideos.length) {
    // THIS MEANS WE ARE DONE CONVERTING ALL DOWNLOADED FILES
    ui.setStatus(ui.STATUS_DONE);
    ui.out('Converted ' + downloadedVideos.length + ' files','success');
    util.openFolder(outputDirectory);
    return;
  }

  videoFileName = downloadedVideos[currentVideoNumber-1];

  audioFileName = videoFileName + '.mp3';

  var converter = newProcess(converterPath, [
      '-y',
      '-i',
      videoFileName,
      '-codec:a',
      'libmp3lame',
      '-qscale:a',
      ui.getAudioQuality(),
      audioFileName
  ],{
    'cwd': outputDirectory
  });

  // FOR SOME REASON FFMPEG OUTPUTS EVERYTHING TO STDERR INSTEAD OF STDOUT
  converter.stdout.on('data', function(chunk) {

    if (cancelRequested) {
      converter.kill('SIGTERM');
    }

    // chunk may include more than line of output at a time
    var lines = chunk.toString().trim().replace(/\r/g,'\n').split('\n');

    for (var key in lines) {
      var line = lines[key];
      ui.out(line, 'muted');
    }
  });

  converter.stderr.on("data", function (data) {

    if (cancelRequested) {
      converter.kill('SIGTERM');
    }

    // chunk may include more than line of output at a time
    var lines = data.toString().trim().replace(/\r/g,'\n').split('\n');

    for (var key in lines) {

      var line = lines[key];
      ui.out(line, 'muted'); // we don't show red text

      // Duration: 00:02:47.90, start: 0.035000, bitrate: 2320 kb/s
      if (line.indexOf('Duration: ') > -1) {
        var timeString = util.getTextBetween(line,'Duration: ',', ').trim();
        videoFileLength = util.getSecondsFromTime(timeString);
      }

      // size= 3958kB time=00:02:47.85 bitrate= 193.2kbits/s
      if (line.indexOf('size=  ') > -1) {

        var timeString = util.getTextBetween(line,'time=',' ').trim();
        var currentLength = util.getSecondsFromTime(timeString);

        // current length can calculate slightly longer than the file length by milliseconds
        if (currentLength > videoFileLength) currentLength = videoFileLength;

        var currentPercentage = Math.round( 100 * 100 * (currentLength / videoFileLength) ) / 100;

        // ui.out('videoFileLength='+videoFileLength+' currentLength='+currentLength+' currentPercentage='+currentPercentage,'info');
        ui.setProgress(currentPercentage);

      }

    }
  });

  converter.on('close', function (code, signal) {
    // do something...?
  });

  converter.on('exit', function (code, signal) {

    if (cancelRequested) {
      ui.out('Conversion cancelled','danger');
      ui.warn('Conversion Cancelled');
      cleanupFiles(false,true);
    }
    else {
      ui.out('Converted file and saved ' + audioFileName + ' to ' + outputDirectory,'success');
    }

    if (!ui.getKeepVideoAfterConversion()) {
      cleanupFiles();
    }

    ui.setProgress(100);

    // recurse to convert all of the videos that were downloaded
    currentVideoNumber++;
    convertToMp3();

  });
}

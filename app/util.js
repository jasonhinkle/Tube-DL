/**
 * Util.js
 * Misc collection of string and time utility functions
 */

const shell = require('electron').shell;

var path = require('path');

/**
 * Return the application directory path
 * @return string file path (with trailing slash)
 */
exports.getApplicationDirectory = function() {
  return path.dirname( process.execPath ) + path.sep;
}

/**
 * Return the user's home directory path
 * @return string file path (with trailing slash)
 */
exports.getHomeDirectory = function() {
  return (process.env.HOME || process.env.USERPROFILE) + path.sep;
}

/**
 * Return the users Desktop directory path
 * @return string file path (with trailing slash)
 */
exports.getDesktopDirectory = function() {
  return exports.getHomeDirectory() + 'Desktop' + path.sep;
}

/**
 * Return the users Desktop directory path
 * @return string file path (with trailing slash)
 */
exports.getDownloadsDirectory = function() {
  return exports.getHomeDirectory() + 'Downloads' + path.sep;
}

/**
 *
 */
exports.makeDirectory = function(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

exports.openURL = function(url) {
  shell.openExternal();
}

exports.openFolder = function(path) {
  shell.showItemInFolder(path);
}

/**
 * Convert a time string into a float value in seconds
 * @param timeString in format "00:00:00.00"
 * @return float total time in seconds
 */
exports.getSecondsFromTime = function(timeString) {
  var timeParts = timeString.toString().split(':');
  return parseFloat( parseFloat(timeParts[0]*60*60) + parseFloat(timeParts[1]*60) + parseFloat(timeParts[2]) );
}

/**
 * Return the text between two landmarks
 * @param string original string
 * @param string the starting landmark (if not provided, start at first character)
 * @param string the ending landmark (if not provided, end at last character)
 * @return string the text between the two landmarks
 */
exports.getTextBetween = function(text, startText, endText) {
  var original = text.toString();
  var start = startText != ''
    ? original.indexOf(startText) + startText.toString().length
    : 0;
  var firstPart = original.substr(start);
  return endText
    ? firstPart.substr(0, firstPart.indexOf(endText))
    : firstPart;
}

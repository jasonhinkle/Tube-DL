/**
 * UI functions
 */

// jquery must be initialized to be available to bootstrap
window.$ = window.jQuery = require('jquery');

// load bootstrap and plugins
require('bootstrap');
require("bootstrap-slider");
require("bootstrap-switch");

exports.STATUS_PENDING = 1;
exports.STATUS_DOWNLOADING_VIDEO = 2;
exports.STATUS_DOWNLOADING_AUDIO = 4;
exports.STATUS_MUXING = 8;
exports.STATUS_CONVERTING = 16;
exports.STATUS_DONE = 32;

// default status
exports.status = exports.STATUS_PENDING;

// ~~~~~~~~~~~~~~~~~~~~~~~~~ INIT UI CONTROLS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports.slider = $("#quality-slider").slider({
  reversed: true,
  tooltip: 'hide'
});

$("#download-format-cb").bootstrapSwitch({
  onText: 'Video',
  offText: 'Audio',
  onColor: 'primary',
  offColor: 'info',
  onSwitchChange: function(event,state){
    if (!state) $('#mp3-options').show('fast');
    if (state) $('#mp3-options').hide('fast');
  }
});

$("#keep-original-cb").bootstrapSwitch({
  onText: 'Yes',
  offText: 'No',
  onColor: 'default',
  offColor: 'default',
  size: 'mini',
  inverse: true
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~ UI BINDING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$("#toggle-debug-btn").on('click',function(e){
  e.preventDefault();
  $output = $("#output");
  if ($output.is(":visible")) {
    $output.hide('fast');
  }
  else {
    $output.show('fast');
    $('#output').scrollTop($('#output')[0].scrollHeight); // scroll to bottom
  }
});

// external links should open in the system browser, not electron shell
$(".external-link").on("click",function(e){
  e.preventDefault();
  shell.openExternal($(this).attr('href'));
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~ UI SETTING ACCESSORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @return int the audio quality setting 2-6
 */
exports.getVideoURL = function() {
  return $('#url-input').val();
}

/**
 * @return int the audio quality setting 2-6
 */
exports.getAudioQuality = function() {
  return exports.slider.slider('getValue');
}

/**
 * @return string "Video" or "Audio"
 */
exports.getDownloadFormat = function() {
  return $("#download-format-cb").bootstrapSwitch('state') ? 'Video' : 'Audio';
}

/**
 * @return bool true if the original video should be kept
 */
exports.getKeepVideoAfterConversion = function() {
  return $("#keep-original-cb").bootstrapSwitch('state');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ PUBLIC METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Display a warning message
 * @param string message. if empty string then hide the warning panel
 */
exports.warn = function(message) {

  $('#warning-message').html('<i class="fa fa-warning"></i> ' + message);

  if (message == '') {
    $('#warning-message').hide('fast');
  }
  else {
    $('#warning-message').show('fast');
  }
}

/**
 * Append a message to the debug output panel
 * @param string message (optional)
 * @param string css style (info, success, danger, etc)
 */
 exports.out = function(message,style) {
  var styleText = style ? ' class="text-'+style+'"' : '';
  $('#output').append("<div" + styleText + ">" + message + "</div>");

  // scroll to bottom
  $('#output').scrollTop($('#output')[0].scrollHeight);

 }

/**
 * clear the output panel with an optional starting message
 * @param string message (optional)
 * @param string css style (info, success, danger, etc)
 */
exports.clear = function(message,style) {
  $('#output').html("");
  if (message) exports.out(message,style);
}

/**
 * display the downloader modal
 */
exports.showModal = function() {
  $('#download-modal').modal({
    show: true,
    keyboard: false,
    backdrop: 'static'
  });
}

/**
 * Setting the status will update all UI elements to whatever default
 * state is approriate for that specific status
 * @param int ui.STATUS_PENDING, ui.STATUS_DOWNLOADING_VIDEO, etc.
 * @param optional parameter to set the modal title, otherwise the default is set
 */
exports.setStatus = function(newStatus, title) {

  exports.status = newStatus;

  if (newStatus == exports.STATUS_PENDING) {
    $('#close-btn').hide();
    $('#cancel-btn').show();
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> One Moment...');
    exports.setDialProgress('progress-video',0);
    exports.setDialProgress('progress-audio',0);
    exports.setDialProgress('progress-mux',0);
    exports.setDialProgress('progress-convert',0);
  }
  else if (newStatus == exports.STATUS_DOWNLOADING_VIDEO) {
    $('#close-btn').hide();
    $('#cancel-btn').show();
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> Downloading Video...');
    // exports.setDialProgress('progress-video',0);
    exports.setDialProgress('progress-audio',0);
    exports.setDialProgress('progress-mux',0);
    exports.setDialProgress('progress-convert',0);
  }
  else if (newStatus == exports.STATUS_DOWNLOADING_AUDIO) {
    $('#close-btn').hide();
    $('#cancel-btn').show();
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> Downloading Audio...');
    exports.setDialProgress('progress-video',100);
    // exports.setDialProgress('progress-audio',0);
    exports.setDialProgress('progress-mux',0);
    exports.setDialProgress('progress-convert',0);
  }
  else if (newStatus == exports.STATUS_MUXING) {
    $('#close-btn').hide();
    $('#cancel-btn').show();
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> Merging Files...');
    exports.setDialProgress('progress-video',100);
    exports.setDialProgress('progress-audio',100);
    // exports.setDialProgress('progress-mux',0);
    exports.setDialProgress('progress-convert',0);
  }
  else if (newStatus == exports.STATUS_CONVERTING) {
    $('#close-btn').hide();
    $('#cancel-btn').show();
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> Converting to MP3...');
    exports.setDialProgress('progress-video',100);
    exports.setDialProgress('progress-audio',100);
    exports.setDialProgress('progress-mux',100);
    // exports.setDialProgress('progress-convert',0);
  }
  else if (newStatus == exports.STATUS_DONE) {
    $('#close-btn').show();
    $('#cancel-btn').hide();
    $('#download-modal-title').html('<i class="fa fa-circle-o"></i> Finished!');
    exports.setDialProgress('progress-video',100);
    exports.setDialProgress('progress-audio',100);
    exports.setDialProgress('progress-mux',100);
    exports.setDialProgress('progress-convert',100);
  }

  if (title) {
    $('#download-modal-title').html('<i class="fa fa-circle-o-notch fa-spin"></i> ' + title);
  }

}

/**
 * Set the progress of one of the individual dials (video, audio, mux, etc)
 * @param string element id
 * @param float the percentage 0 - 100
 */
exports.setDialProgress = function(id,percent) {

   $dial = $('#'+id);
   // remove the previous status: p10,p25,p50, etc.
   var classes = $dial.attr('class').split(/\s+/);
   $.each(classes, function(index, item) {
     if (item.substr(0,1) == 'p') {
       $dial.removeClass(item);
     }
   });

   $dial.addClass('p'+Math.round(percent));
   $('#'+id+' span').html(Math.round(percent)+'%');
}

/**
 * Setting the progress updates the main progress bar and, depending on
 * the "status" will also update the individual dials.  The main
 * progress percentage is weighted to account for the 4 different stages.
 * @param float percentage 0 - 100
 */
exports.setProgress = function (percent) {

  var pVideo = 70;
  var pAudio = 12;
  var pMux = 3;
  var pConvert = 15;

  var fullPercent = percent;

  if (exports.status == exports.STATUS_DOWNLOADING_VIDEO) {
    fullPercent = 0 + (percent * pVideo/100);
    exports.setDialProgress('progress-video',percent);
  }
  else if (exports.status == exports.STATUS_DOWNLOADING_AUDIO) {
    fullPercent = pVideo + (percent * pAudio/100);
    exports.setDialProgress('progress-audio',percent);
  }
  else if (exports.status == exports.STATUS_MUXING) {
    fullPercent = pVideo + pAudio + (percent * pMux/100);
    exports.setDialProgress('progress-mux',percent);
  }
  else if (exports.status == exports.STATUS_CONVERTING) {
    fullPercent = pVideo + pAudio + pMux + (percent * pConvert/100);
    exports.setDialProgress('progress-convert',percent);
  }

  fullPercent = Math.round(fullPercent * 100) / 100;

  var label = fullPercent == 0 ? '' : fullPercent+'%';

  $('#dl-progress-bar .progress-bar')
    .css('width', fullPercent+'%')
    .attr('aria-valuenow', percent)
    .html(label);

  if (fullPercent < 100) {
    $('#dl-progress-bar .progress-bar').addClass('active');
  }
  else {
    $('#dl-progress-bar .progress-bar').removeClass('active');
  }

}

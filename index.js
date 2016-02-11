/**
 * index.js is the starting point for execution. This file
 * is responsible for instantiating the application, intitializing the
 * main window and native menus
 */

// --- system libraries ---
const app = require('app');
const BrowserWindow = require('browser-window');
const Menu = require('menu');
const MenuItem = require('menu-item');
const dialog = require('dialog');

// --- environment variables ---
// NODE_ENV = 'production' in debug build, and undefined in release build
const isDebugMode = typeof(process.env.NODE_ENV) != 'undefined';
const isOSX = process.platform == 'darwin';

/**
 * Once app is ready we can begin creating the UI
 */
app.on('ready',function(){

  var menu = Menu.buildFromTemplate(getMenuTemplate());
	Menu.setApplicationMenu(menu);

  var mainWin = new BrowserWindow({
    width: 700,
    height: (!isOSX) ? 590 : 550, // account for windows chrome
    resizable: isDebugMode
  });

  mainWin.loadURL('file://' + __dirname + '/index.html');

});

/**
 * Quit app when all windows are closed (on OSX).
 */
app.on('window-all-closed', function() {
  // if (process.platform != 'darwin')
    app.quit();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Return the native menu structure
 * @return array
 */
function getMenuTemplate() {

  return [
    {
      label: 'Master Tour',
      submenu: [
        {
          label: 'About Tube DL',
          selector: 'orderFrontStandardAboutPanel:'
        },{
          type: 'separator'
        },{
          label: 'Services',
          submenu: []
        },{
          type: 'separator'
        },{
          label: 'Hide Tube DL',
          accelerator: 'Command+H',
          selector: 'hide:'
        },{
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },{
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },{
          type: 'separator'
        },{
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },{
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },{
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },{
          type: 'separator'
        },{
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },{
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },{
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },{
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    },{
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache(); }
        },{
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },{
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },{
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },{
          type: 'separator'
        },{
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },{
      label: 'Help',
      submenu: []
    },
  ];

}

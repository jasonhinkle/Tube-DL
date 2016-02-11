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

  var template = [];

  if (isOSX) {

    // ############ OSX APPLICATION MENU #############

    template.push({
      label: 'Tube DL',
      submenu: [
        {
          label: 'About Tube DL',
          role: 'about'
        },{
          type: 'separator'
        },{
          label: 'Services',
          submenu: []
        },{
          type: 'separator'
        },{
          label: 'Hide Tube DL',
          accelerator: 'CmdOrCtrl+H',
          role: 'hide'
        },{
          label: 'Hide Others',
          accelerator: 'CmdOrCtrl+Shift+H',
          role: 'hideothers'
        },{
          label: 'Show All',
          role: 'unhide'
        },{
          type: 'separator'
        },{
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: function() { app.quit(); }
        }
      ]
    });
  }
  else {

    // ############ WINDOWS FILE MENU #############
    template.push({
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: function() { app.quit(); }
        }
      ]
    });
  }

  // ############ EDIT MENU #############
  template.push({
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  });

    // ############ VIEW MENU #############
    template.push({
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (isOSX)
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
      ]
    });

    if (isOSX) {

      // ############ WINDOW MENU #############
      template.push({
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            role: 'front'
          }
        ]
      });

      // ############ OSX HELP MENU #############
      template.push({
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'About Tube DL',
            role: 'about'
          },{
            type: 'separator'
          },{
            label: 'Visit Developer Site',
            click: function() { require('electron').shell.openExternal('http://verysimple.com/') }
          },
        ]
      });
    }
    else {
      // ############ WINDOWS HELP MENU #############
      template.push({
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Visit Developer Site',
            click: function() { require('electron').shell.openExternal('http://verysimple.com/') }
          },
        ]
      });
    }

    return template;
}

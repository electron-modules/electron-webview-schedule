'use strict';

const url = require('url');
const path = require('path');
require('@electron/remote/main').initialize();
const WindowManager = require('electron-windows');

const loadingUrl = url.format({
  pathname: path.join(__dirname, 'renderer', 'loading.html'),
  protocol: 'file:',
});

class App {
  constructor() {
    this.windowManager = new WindowManager();
  }

  init() {
    this.initWindow();
  }

  showMain() {
    const mainUrl = url.format({
      pathname: path.join(__dirname, 'renderer', 'main.html'),
      protocol: 'file:',
    });
    this.windowManager.get('test').loadURL(mainUrl);
  }

  initWindow() {
    const windowSize = {
      width: 1280,
      height: 800,
    };
    this.windowManager.create({
      name: 'test',
      loadingView: {
        url: loadingUrl,
      },
      browserWindow: {
        ...windowSize,
        title: 'test',
        show: true,
        acceptFirstMouse: true,
        webPreferences: {
          enableRemoteModule: false,
          nodeIntegration: false,
          webSecurity: true,
          webviewTag: true,
          preload: path.join(__dirname, 'renderer', 'preload.js'),
        },
      },
    });
  }
}

module.exports = App;

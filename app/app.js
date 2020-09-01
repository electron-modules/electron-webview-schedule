'use strict';

const url = require('url');
const path = require('path');
const _ = require('lodash');

const {
  app: electronApp, BrowserWindow, BrowserView,
} = require('electron');

class App {
  constructor(options = {}) {
  }

  init() {
    this.mainWindow = this.initWindow();
  }

  showMain() {
    const mainUrl = url.format({
      pathname: path.join(__dirname, 'renderer', 'main.html'),
      protocol: 'file:',
    });
    this.mainWindow.loadURL(mainUrl);
  }

  initWindow() {
    const windowSize = {
      width: 1280,
      height: 800,
    };

    const win = new BrowserWindow({
      ...windowSize,
      title: 'test',
      show: true,
      acceptFirstMouse: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        webviewTag: true,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    });
    const loadingUrl = url.format({
      pathname: path.join(__dirname, 'renderer', 'loading.html'),
      protocol: 'file:',
    });
  
    const loadingView = new BrowserView();
    const [ viewWidth, viewHeight ] = win.getSize();
    win.setBrowserView(loadingView);
    loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
    loadingView.webContents.loadURL(loadingUrl);

    win.on('resize', _.debounce(() => {
      const [ viewWidth, viewHeight ] = win.getSize();
      loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
    }, 500));
    win.webContents.on('dom-ready', () => {
      win.removeBrowserView(loadingView);
    });
    // win.webContents.on('unresponsive', () => {
    // });
    win.webContents.on('crashed', () => {
      setTimeout(() => {
        electronApp.relaunch();
        electronApp.exit();
      }, 3000);
    });
    // 页面卡死兜底
    win.on('unresponsive', () => {
      setTimeout(() => {
        win.reload();
      }, 3000);
    });
    win.on('show', () => {
    });
    win.on('blur', () => {
      win.webContents.send('window-blur');
    });
    win.on('focus', () => {
      win.webContents.send('window-focus');
    });
    win.on('scroll-touch-begin', () => {
      win.webContents.send('scroll-touch-begin');
    });
    win.on('scroll-touch-end', () => {
      win.webContents.send('scroll-touch-end');
    });
    win.on('close', async (event) => {
      event.preventDefault();
      win.hide();
      win.webContents.send('window-will-hide');
    });
    return win;
  }
}

module.exports = App;

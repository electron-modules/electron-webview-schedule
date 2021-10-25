'use strict';

const { app: electronApp, webContents } = require('electron');

const App = require('./app');

electronApp.on('ready', () => {
  const app = new App();
  app.init();
  setTimeout(() => {
    app.showMain();
  }, 1000);
  setInterval(() => {
    const allWebContents = webContents.getAllWebContents();
    console.log(allWebContents.map(item => {
      return {
        id: item.id,
        type: item.getType(),
      };
    }));
  }, 1000);
});

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    receive: (channel, fn) => {
      ipcRenderer.on(channel, (event, ...args) => fn(event, ...args));
    },
    sendToHost: (channel, args) => {
      ipcRenderer.sendToHost(channel, args);
    },
    crash: () => process.crash(),
    hang: () => process.hang(),
  }
);

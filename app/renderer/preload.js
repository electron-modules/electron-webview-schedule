'use strict';

const { contextBridge } = require('electron');
const { getCurrentWindow } = require('@electron/remote');

contextBridge.exposeInMainWorld(
  'electron',
  {
    openDevTool: () => getCurrentWindow().webContents.openDevTools(),
  }
);


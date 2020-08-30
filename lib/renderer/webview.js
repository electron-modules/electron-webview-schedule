'use strict';

const { ipcRenderer } = require('electron');

ipcRenderer.on('send-to-webview', (_, data) => {
  console.log(data);
  ipcRenderer.sendToHost('send-to-host', {
    foo: 'bar',
  });
});

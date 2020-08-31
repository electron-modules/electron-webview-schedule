'use strict';

const { ipcRenderer } = require('electron');

window.onload = () => {
  ipcRenderer.on('send-to-webview', (_, data) => {
    console.log(data);
    ipcRenderer.sendToHost('send-to-host', {
      foo: 'bar',
    });
  });

  const container = document.querySelector('.wrapper');
  const search = window.location.search;
  container.innerHTML = JSON.stringify(search);
};

'use strict';

const { ipcRenderer } = require('electron');

window.onload = () => {
  const container = document.querySelector('#desc');
  const urlParams = new URLSearchParams(window.location.search);
  const webviewType = urlParams.get('webviewType');
  const loadedAt = new Date();
  const genDesc = (text = '') => {
    return [
      webviewType,
      loadedAt,
      text,
    ].join('<br />');
  };
  container.innerHTML = genDesc();
  ipcRenderer.on('send-to-webview', (_, data) => {
    container.innerHTML = genDesc(data.date);
    ipcRenderer.sendToHost('send-to-host', {
      webviewType,
    });
  });
  document.querySelector('#remove').addEventListener('click', () => {
    ipcRenderer.sendToHost('remove-webview');
  }, false);
  document.querySelector('#crash').addEventListener('click', () => {
    process.crash();
  }, false);
  document.querySelector('#hang').addEventListener('click', () => {
    process.hang();
  }, false);
};

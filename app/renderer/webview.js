'use strict';

const { moment } = window;

window.onload = () => {
  const container = document.querySelector('#desc');
  const urlParams = new URLSearchParams(window.location.search);
  const webviewType = urlParams.get('webviewType');
  const loadedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  let executeNum = -1;
  const genDesc = (text = '') => {
    executeNum++;
    return [
      webviewType,
      loadedAt,
      text,
      executeNum,
    ].join('<br />');
  };
  container.innerHTML = genDesc();
  window.electron.receive('send-to-webview', (_, data) => {
    container.innerHTML = genDesc(data.date);
    window.electron.sendToHost('send-to-host', { webviewType });
  });
  document.querySelector('#remove').addEventListener('click', () => {
    window.electron.sendToHost('remove-webview');
  }, false);
  document.querySelector('#crash').addEventListener('click', () => {
    window.electron.crash();
  }, false);
  document.querySelector('#hang').addEventListener('click', () => {
    window.electron.hang();
  }, false);
};

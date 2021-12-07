'use strict';

const { WebviewSchedule, PromiseQueue, moment } = window;

const webviewContainer = document.querySelector('#webview');

window._webviewManager = new WebviewSchedule({
  container: webviewContainer,
  queue: new PromiseQueue(1),
  moment,
  webviewOptions: {
    eventsStack: [],
    getSrcFromType: type => {
      return `./webview.html?webviewType=${type}`;
    },
    preload: './webview-preload.js',
    attributes: {},
  },
});

document.querySelector('#add1').addEventListener('click', () => {
  window._webviewManager.send('webview1', 'send-to-webview', {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}, false);
document.querySelector('#add2').addEventListener('click', () => {
  window._webviewManager.send('webview2', 'send-to-webview', {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}, false);
document.querySelector('#add3').addEventListener('click', () => {
  window._webviewManager.send('webview3', 'send-to-webview', {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}, false);
document.querySelector('#add4').addEventListener('click', () => {
  window._webviewManager.send('webview4', 'send-to-webview', {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}, false);
document.querySelector('#add5').addEventListener('click', () => {
  window._webviewManager.send('webview5', 'send-to-webview', {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
}, false);
document.querySelector('#clear').addEventListener('click', () => {
  window._webviewManager.clearAll();
}, false);
document.querySelector('#debug').addEventListener('click', () => {
  window.electron.openDevTool();
}, false);

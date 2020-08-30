'use strict';

const initWebview = ({ container }) => {
  const webview = document.createElement('webview');
  const attrs = {
    autosize: 'on',
    nodeintegration: 'true',
    disablewebsecurity: 'false',
    enableblinkfeatures: 'PreciseMemoryInfo',
    src: './webview.html',
  };

  for (const key in attrs) {
    const attr = attrs[key];
    webview.setAttribute(key, attr);
  }

  webview.addEventListener('ipc-message', (event) => {
    console.log(event);
  });

  return new Promise(resolve => {
    container.appendChild(webview);
    webview.addEventListener('dom-ready', () => {
      // Remove this once https://github.com/electron/electron/issues/14474 is fixed
      webview.blur();
      webview.focus();
      resolve(webview);
    });
  });
};

const webviewContainer = document.querySelector('#webview');

const init = async () => {
  const webview1 = await initWebview({
    container: webviewContainer,
  });
  const webview2 = await initWebview({
    container: webviewContainer,
  });
  console.log(webview1);
  console.log(webview2);
  window.webview1 = webview1;
  window.webview2 = webview2;
};

init().then(() => {
  console.log('then');
}).catch(e => {
  console.log(e);
});

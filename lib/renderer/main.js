'use strict';

const { PromiseQueue } = global;

class WebviewManager {
  constructor(options) {
    this.container = options.container;
  }

  clearAll() {
    this.container.innerHTML = '';
  }

  initWebview() {
    const webview = document.createElement('webview');
    const attrs = {
      autosize: 'on',
      nodeintegration: 'true',
      disablewebsecurity: 'false',
      enableblinkfeatures: 'PreciseMemoryInfo',
      src: './webview.html?a=b',
    };
  
    for (const key in attrs) {
      const attr = attrs[key];
      webview.setAttribute(key, attr);
    }
  
    webview.addEventListener('ipc-message', (event) => {
      console.log(event);
    });
  
    return new Promise(resolve => {
      this.container.appendChild(webview);
      webview.addEventListener('dom-ready', () => {
        // Remove this once https://github.com/electron/electron/issues/14474 is fixed
        webview.blur();
        webview.focus();
        resolve(webview);
      });
    });
  }

  send() {
    // 1. 检测类型
    // 2. 是否有可用
    // 3. 回调
    return new Promise(resolve => {
    });
  }
}

(async () => {
  const webviewContainer = document.querySelector('#webview');

  window._webviewManager = new WebviewManager({
    container: webviewContainer,
  });
  const webview1 = await window._webviewManager.initWebview();

  document.querySelector('#add')
    .addEventListener('click', async () => {
      await window._webviewManager.initWebview();
    }, false);
  document.querySelector('#clear')
    .addEventListener('click', async () => {
      window._webviewManager.clearAll();
    }, false);
})().then(console.log).catch(console.log);

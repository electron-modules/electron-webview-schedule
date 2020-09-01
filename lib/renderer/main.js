'use strict';

const { PromiseQueue } = global;

class WebviewManager {
  constructor(options) {
    this.container = options.container;
    this.queue = new PromiseQueue(1);
  }

  clearAll() {
    this.container.innerHTML = '';
  }

  initWebview(webviewType) {
    const webview = document.createElement('webview');
    const attrs = {
      autosize: 'on',
      nodeintegration: 'true',
      disablewebsecurity: 'false',
      enableblinkfeatures: 'PreciseMemoryInfo',
      src: `./webview.html?webviewType=${webviewType}`,
      webviewType,
    };

    for (const key in attrs) {
      const attr = attrs[key];
      webview.setAttribute(key, attr);
    }

    webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'remove-webview') {
        webview.setAttribute('removedAt', new Date());
      }
      console.log(event.channel, ...event.args);
    });

    webview.addEventListener('crashed', () => {
      webview.setAttribute('removedAt', new Date());
    });

    webview.addEventListener('destroyed', () => {
      webview.setAttribute('removedAt', new Date());
    });

    // not work
    // webview.addEventListener('unresponsive', () => {
    //   console.log('unresponsive');
    //   webview.setAttribute('removedAt', new Date());
    // });

    webview.addEventListener('close', () => {
      webview.setAttribute('removedAt', new Date());
    });

    webview.addEventListener('did-fail-load', () => {
      webview.setAttribute('removedAt', new Date());
    });

    return new Promise(resolve => {
      this.container.appendChild(webview);
      webview.addEventListener('dom-ready', () => {
        // Remove this once https://github.com/electron/electron/issues/14474 is fixed
        webview.blur();
        webview.focus();
        webview.domReadyAt = new Date();
        console.log('webview dom ready', webviewType);
        resolve();
      });
    });
  }

  clearGarbage() {
    const webviews = document.querySelectorAll('[removedAt]');
    for (let i = 0; i < webviews.length; i++) {
      this.container.removeChild(webviews[i]);
    }
  }

  prepareWebviewTag(webviewType) {
    let webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
    try {
      if (webview && webview.domReadyAt && webview.isCrashed()) {
        webview.setAttribute('removedAt', new Date());
      }
    } catch (_) {
      webview.setAttribute('removedAt', new Date());
    }
    this.clearGarbage();
    webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
    if (!webview) {
      this.queue.add(() => {
        return this.initWebview(webviewType);
      });
    }
  }

  send(webviewType, data) {
    this.prepareWebviewTag(webviewType);
    this.queue.add(() => {
      const webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
      console.log(webview.domReadyAt);
      return webview.send('send-to-webview', data);
    }).catch(() => {
      console.log('send error');
    });
  }
}

const webviewContainer = document.querySelector('#webview');

window._webviewManager = new WebviewManager({
  container: webviewContainer,
});

document.querySelector('#add1').addEventListener('click', () => {
  window._webviewManager.send('webview1', {
    date: new Date(),
  });
}, false);
document.querySelector('#add2').addEventListener('click', () => {
  window._webviewManager.send('webview2', {
    date: new Date(),
  });
}, false);
document.querySelector('#add3').addEventListener('click', () => {
  window._webviewManager.send('webview3', {
    date: new Date(),
  });
}, false);
document.querySelector('#add4').addEventListener('click', () => {
  window._webviewManager.send('webview4', {
    date: new Date(),
  });
}, false);
document.querySelector('#add5').addEventListener('click', () => {
  window._webviewManager.send('webview5', {
    date: new Date(),
  });
}, false);
document.querySelector('#clear').addEventListener('click', () => {
  window._webviewManager.clearAll();
}, false);
document.querySelector('#debug').addEventListener('click', () => {
  require('electron').remote.getCurrentWindow().webContents.openDevTools();
}, false);

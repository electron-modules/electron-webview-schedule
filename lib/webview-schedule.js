'use strict';

((root, factory) => {
  if (typeof module === 'object' && module.exports && typeof require === 'function') {
    module.exports = factory();
    const isElectronRenderer = typeof window !== 'undefined' && window.process && window.process.type;
    if (isElectronRenderer) {
      root.WebviewSchedule = factory();
    }
  } else {
    root.WebviewSchedule = factory();
  }
})(this, () => {

  class WebviewSchedule {
    constructor(options) {
      this.container = options.container;
      this.webviewOptions = options.webviewOptions;
      this.queue = options.queue;
      this.moment = options.moment;
      this.logger = options.logger || window.console;
    }

    clearAll() {
      this.container.innerHTML = '';
    }

    initWebview(webviewType) {
      const webview = document.createElement('webview');
      const attrs = Object.assign({
        id: `webview-${+new Date()}`,
        autosize: 'on',
        nodeintegration: 'true',
        disablewebsecurity: 'false',
        enableblinkfeatures: 'PreciseMemoryInfo',
        src: this.webviewOptions.getSrcFromType(webviewType),
        preload: this.webviewOptions.preload,
        webviewType,
      }, this.webviewOptions.attributes);

      for (const key in attrs) {
        const attr = attrs[key];
        webview.setAttribute(key, attr);
      }

      webview.addEventListener('ipc-message', (...args) => {
        const event = args[0];
        if (event && event.channel === 'remove-webview') {
          webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
        }
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'ipc-message')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('found-in-page', (...args) => {
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'found-in-page')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('search-found-in-page', (...args) => {
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'search-found-in-page')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('search-found-in-page-next', (...args) => {
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'search-found-in-page-next')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('search-found-in-page-prev', (...args) => {
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'search-found-in-page-prev')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('search-stop-find-in-page', (...args) => {
        this.webviewOptions.eventsStack
          .filter(item => item.eventName === 'search-stop-find-in-page')
          .map(event => event.handler(...args));
      });

      webview.addEventListener('crashed', () => {
        webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
      });

      webview.addEventListener('destroyed', () => {
        webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
      });

      // not work
      // webview.addEventListener('unresponsive', () => {
      //   console.log('unresponsive');
      //   webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
      // });

      webview.addEventListener('close', () => {
        webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
      });

      webview.addEventListener('did-fail-load', (e) => {
        if (webview.src === e.validatedURL) {
          webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
        }
      });

      return new Promise(resolve => {
        this.container.appendChild(webview);
        webview.addEventListener('dom-ready', () => {
          webview.domReadyAt = this.moment().format('YYYY-MM-DD HH:mm:ss');
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
          webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
        }
      } catch (_) {
        webview.setAttribute('removedAt', this.moment().format('YYYY-MM-DD HH:mm:ss'));
      }
      this.clearGarbage();
      webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
      if (!webview) {
        this.queue.add(() => {
          return this.initWebview(webviewType);
        });
      }
    }

    send(webviewType, eventName, data) {
      this.prepareWebviewTag(webviewType);
      this.queue.add(() => {
        const webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
        const webviews = this.container.querySelectorAll('webview');
        for (let i = 0; i < webviews.length; i++) {
          if (webview.id === webviews[i].id) {
            webview.style.display = 'inline-flex';
          } else {
            webviews[i].style.display = 'none';
          }
        }
        return webview.send(eventName, data);
      }).catch(e => {
        this.logger.error(e, 'send error');
      });
    }

    loadURL(webviewType, url, options = {}) {
      this.prepareWebviewTag(webviewType);
      this.queue.add(() => {
        const webviews = this.container.querySelectorAll('webview');
        const webview = this.container.querySelector(`[webviewType="${webviewType}"]`);
        webview.loadURL(url, options);
        for (let i = 0; i < webviews.length; i++) {
          if (webview.id === webviews[i].id) {
            webview.style.display = 'inline-flex';
          } else {
            webviews[i].style.display = 'none';
          }
        }
      }).catch(e => {
        this.logger.error(e, 'loadURL failed');
      });
    }
  }

  return WebviewSchedule;
});

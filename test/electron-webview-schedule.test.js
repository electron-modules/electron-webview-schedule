'use strict';

const assert = require('assert');
const moment = require('moment');

const PromiseQueue = require('../lib/promise-queue');
const WebviewSchedule = require('../lib/webview-schedule');

describe('./test/electron-webview-schedule.test.js', () => {
  it('constructor should be ok', () => {
    assert(WebviewSchedule);
  });

  it('method should be ok', () => {
    const webviewSchedule = new WebviewSchedule({
      container: document.body,
      queue: new PromiseQueue(1),
      moment,
      webviewOptions: {
        eventsStack: [],
        attributes: {
        },
      },
    });

    assert(webviewSchedule.container);
    assert(webviewSchedule.webviewOptions);
    assert(webviewSchedule.queue);
    assert(webviewSchedule.send);
  });
});

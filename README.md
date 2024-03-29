# electron-webview-schedule

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/electron-webview-schedule.svg
[npm-url]: https://npmjs.org/package/electron-webview-schedule
[travis-image]: https://api.travis-ci.com/electron-modules/electron-webview-schedule.svg?branch=master
[travis-url]: https://travis-ci.com/github/electron-modules/electron-webview-schedule
[coveralls-image]: https://img.shields.io/coveralls/electron-modules/electron-webview-schedule.svg
[coveralls-url]: https://coveralls.io/r/electron-modules/electron-webview-schedule?branch=master
[download-image]: https://img.shields.io/npm/dm/electron-webview-schedule.svg
[download-url]: https://npmjs.org/package/electron-webview-schedule

> Webview scheduling management module supporting asynchronous queue for Electron.

---

## Installment

```bash
$ npm i electron-webview-schedule --save
```

## Usage

Import in the renderer process.

```javascript
import moment from 'moment';
import PromiseQueue from 'electron-webview-schedule/lib/promise-queue';
import WebviewSchedule from 'electron-webview-schedule/lib/webview-schedule';

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

webviewSchedule.send('channel-foo', args);
```

## Development

```bash
$ npm i
$ npm run dev
```

![](./demo.png)

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/17586742?v=4" width="100px;"/><br/><sub><b>sriting</b></sub>](https://github.com/sriting)<br/>|[<img src="https://avatars.githubusercontent.com/u/4081746?v=4" width="100px;"/><br/><sub><b>zlyi</b></sub>](https://github.com/zlyi)<br/>|[<img src="https://avatars.githubusercontent.com/u/50158871?v=4" width="100px;"/><br/><sub><b>moshangqi</b></sub>](https://github.com/moshangqi)<br/>|
| :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Thu Feb 23 2023 23:47:00 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)

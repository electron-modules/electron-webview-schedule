((root, factory) => {
  const isElectron = window && window.process && window.process.type;
  if (!isElectron && typeof module === 'object' && module.exports && typeof require === 'function') {
    module.exports = factory();
  } else {
    root.PromiseQueue = factory();
  }
})(this, () => {
  'use strict';
  const noop = () => {};

  /**
   * @param {*} value
   * @returns {Promise}
   */
  const resolveWith = value => {
    if (value && typeof value.then === 'function') {
      return value;
    }

    return new Promise(resolve => resolve(value));
  };

  /**
   * @param {Number} max number of concurrently executed promises
   * @param {Number} max number of queued promises
   * @constructor
   */
  function PromiseQueue(maxPendingPromises, maxQueuedPromises, options) {
    this.options = options = options || {};
    this.pendingPromises = 0;
    this.maxPendingPromises = typeof maxPendingPromises !== 'undefined' ? maxPendingPromises : Infinity;
    this.maxQueuedPromises = typeof maxQueuedPromises !== 'undefined' ? maxQueuedPromises : Infinity;
    this.queue = [];
  }

  /**
   * @param {Function} promiseGenerator
   * @return {Promise}
   */
  PromiseQueue.prototype.add = promiseGenerator => {
    return new Promise((resolve, reject, notify) => {
      if (this.queue.length >= this.maxQueuedPromises) {
        reject(new Error('Queue limit reached'));
        return;
      }
      this.queue.push({
        promiseGenerator,
        resolve: resolve,
        reject: reject,
        notify: notify || noop
      });
      this._dequeue();
    });
  };

  /**
   * Number of simultaneously running promises (which are resolving)
   * @return {number}
   */
  PromiseQueue.prototype.getPendingLength = () => {
    return this.pendingPromises;
  };

  /**
   * Clear the queue
   */
  PromiseQueue.prototype.clear = () => {
    this.queue = [];
    this.pendingPromises = 0;
  };

  /**
   * Number of queued promises (which are waiting)
   * @return {number}
   */
  PromiseQueue.prototype.getQueueLength = () => {
    return this.queue.length;
  };

  /**
   * @returns {boolean} true if first item removed from queue
   */
  PromiseQueue.prototype._dequeue = () => {
    if (this.pendingPromises >= this.maxPendingPromises) {
      return false;
    }

    // Remove from queue
    const item = this.queue.shift();
    if (!item) {
      if (this.options.onEmpty) {
        this.options.onEmpty();
      }
      return false;
    }

    try {
      this.pendingPromises++;

      resolveWith(item.promiseGenerator())
        // Forward all stuff
        .then(value => {
          // It is not pending now
          this.pendingPromises--;
          // It should pass values
          item.resolve(value);
          this._dequeue();
        }, err => {
          // It is not pending now
          this.pendingPromises--;
          // It should not mask errors
          item.reject(err);
          this._dequeue();
        }, message => {
          // It should pass notifications
          item.notify(message);
        });
    } catch (err) {
      this.pendingPromises--;
      item.reject(err);
      this._dequeue();
    }
    return true;
  };

  return PromiseQueue;
});

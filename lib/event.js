function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let event;

class Event {
  static emit(eventName, ...args) {
    return event.emit(eventName, ...args);
  }

  static names() {
    return event.names();
  }

  static listenerCount(eventName) {
    return event.listenerCount(eventName);
  }

  static listeners(eventName) {
    return event.listeners(eventName);
  }

  static addListener(eventName, listener) {
    return event.addListener(eventName, listener);
  }

  static prependListener(eventName, listener) {
    return event.prependListener(eventName, listener);
  }

  static once(eventName, listener) {
    return event.once(eventName, listener);
  }

  static prependOnceListener(eventName, listener) {
    return event.prependOnceListener(eventName, listener);
  }

  static removeListener(eventName, listener) {
    return event.removeListener(eventName, listener);
  }

  static removeAllListeners(eventName) {
    return event.removeAllListeners(eventName);
  }

  static on(eventName, listener) {
    return event.on(eventName, listener);
  }

  static off(eventName, listener) {
    return event.off(eventName, listener);
  }

  constructor() {
    _defineProperty(this, "_linsters", {});

    this._linsters = {};
  }

  emit(eventName, ...args) {
    let list = this._linsters[eventName];

    if (!list) {
      return;
    }

    for (let i = 0, l = list.length; i < l;) {
      let [listener, once] = list[i];

      try {
        listener(...args);
      } catch (e) {}

      if (once) {
        list.splice(i, 1);
        l--;
      } else {
        i++;
      }
    }

    if (!list.length) {
      delete this._linsters[eventName];
    }
  }

  names() {
    return Object.keys(this._linsters);
  }

  listenerCount(eventName) {
    let list = this._linsters[eventName];
    return list ? list.length : 0;
  }

  listeners(eventName) {
    let list = this._linsters[eventName];

    if (!list) {
      return [];
    }

    return list.map(([listener]) => listener);
  }

  addListener(eventName, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    let list = this._linsters[eventName];

    if (!list) {
      list = this._linsters[eventName] = [];
    }

    list.push([listener]);
  }

  prependListener(eventName, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    let list = this._linsters[eventName];

    if (!list) {
      list = this._linsters[eventName] = [];
    }

    list.unshift([listener]);
  }

  once(eventName, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    let list = this._linsters[eventName];

    if (!list) {
      list = this._linsters[eventName] = [];
    }

    list.push([listener, true]);
  }

  prependOnceListener(eventName, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    let list = this._linsters[eventName];

    if (!list) {
      list = this._linsters[eventName] = [];
    }

    list.unshift([listener, true]);
  }

  removeListener(eventName, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    let list = this._linsters[eventName];

    if (!list) {
      return;
    }

    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i][0] === listener) {
        list.splice(i, 1);
        break;
      }
    }

    if (!list.length) {
      delete this._linsters[eventName];
    }
  }

  removeAllListeners(eventName) {
    if (!eventName) {
      this._linsters = {};
    } else {
      delete this._linsters[eventName];
    }
  }

  on(eventName, listener) {
    return this.addListener(eventName, listener);
  }

  off(eventName, listener) {
    return this.removeListener(eventName, listener);
  }

}

event = new Event();
export default Event;
//# sourceMappingURL=event.js.map
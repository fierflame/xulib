function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** 计时器 */
class Timer {
  //暂停状态
  //暂停开始时间
  //已暂停时间
  //初始化时间
  constructor() {
    _defineProperty(this, "_pausing", false);

    _defineProperty(this, "_pause", 0);

    _defineProperty(this, "_paused", 0);

    _defineProperty(this, "_begin", 0);

    this._pausing = false;
    this._pause = 0;
    this._paused = 0;
    this._begin = Timer.getTime();
  }

  static next(f, ...p) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return new Promise(r => f.call(_this, r, ...p));
    })();
  }

  static nextRescissible(f, c, ...p) {
    let canceled = false;
    let cancelError = undefined;
    let cancel = undefined;
    const next = new Promise((resolve, reject) => {
      if (canceled) {
        return cancelError === undefined ? resolve() : reject(cancelError);
      }

      const t = f.call(this, () => {
        canceled = true;
        resolve();
      }, ...p);

      cancel = error => {
        if (canceled) {
          return;
        }

        canceled = true;
        c(t);
        return error === undefined ? resolve() : reject(error);
      };
    });

    next.cancel = error => {
      if (canceled) {
        return;
      }

      if (cancel) {
        cancel(error);
      }

      cancelError = error;
      canceled = true;
    };

    return next;
  }
  /** 延时 */


  static delayed(ms) {
    return Timer.nextRescissible(f => setTimeout(f, ms), clearTimeout);
  }
  /** 等待进入下一帧渲染 */


  static nextFrame(gl) {
    return _asyncToGenerator(function* () {
      return Timer.nextRescissible(gl.requestAnimationFrame.bind(gl), gl.cancelAnimationFrame.bind(gl));
    })();
  }
  /** 获取当前时间 */


  static getTime() {
    try {
      return performance.now();
    } catch (e) {}

    return +new Date();
  }
  /** 继续计时 */


  run() {
    if (!this._pausing) {
      return;
    }

    this._pausing = false;
    this._paused += Timer.getTime() - this._pause;
  }
  /** 暂停计时 */


  pause() {
    if (this._pausing) {
      return;
    }

    this._pausing = true;
    this._pause = Timer.getTime();
  }
  /** 已暂停时间 */


  get paused() {
    return this._paused + (this._pausing ? Timer.getTime() - this._pause : 0);
  }
  /** 已经执行时间 */


  get time() {
    return (this._pausing ? this._pause : Timer.getTime()) - this._begin - this._paused;
  }
  /** 获取已经执行时间 */


  get() {
    return this.time;
  }

}

export default Timer;
//# sourceMappingURL=timer.js.map
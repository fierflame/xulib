function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/** 封装成只会执行一次的函数，封装后函数，只会返回第一次执行时得到的结果(包括抛出的错误) */
export function once(f) {
  let run = false;
  let error = false;
  let ret;
  return function (...p) {
    if (run) {
      if (error) {
        throw ret;
      }

      return ret;
    }

    run = true;

    try {
      return ret = f.call(this, ...p);
    } catch (e) {
      error = true;
      ret = e;
      throw ret;
    }
  };
}
/** 封装成合并执行的函数，封装后函数永远返回Promise，上次执行时得到的Promise未结束前，返回的将会是同一个Promise */

export function merge(f) {
  let ret;
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (...argv) {
        if (ret) {
          return ret;
        }

        try {
          ret = f.call(this, ...argv);
          return yield ret;
        } finally {
          ret = undefined;
        }
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}
/** 封装成执行队列，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余执行将会加入队列，直到有Promise完成 */

export function queue(f, max = 1) {
  const queue = [];
  let wait = 0;

  function next() {
    if (queue.length) {
      queue.shift()();
    } else {
      wait--;
    }
  }

  function getRunStatus() {
    return new Promise(r => wait < max ? r(void wait++) : queue.push(r));
  }

  function get(f) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (...argv) {
          try {
            yield getRunStatus();
            return yield f.call(this, ...argv);
          } finally {
            next();
          }
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  }

  if (typeof f === 'function') {
    return get(f);
  } else if (Array.isArray(f)) {
    return f.map(f => typeof f === 'function' ? undefined : get(f));
  }
}
/** 封装成忽略性执行，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余只保留最后一个，担有一个Promise完成，执行最后一次参数 */

export function ignore(f, max = 1) {
  let run = 0;
  let next;
  let end = [];

  function getEndFunc() {
    let e = end;
    end = [];
    return e;
  }

  function getNextParam() {
    let p = next;
    next = undefined;
    return p;
  }

  function setNextParam(p) {
    next = p;
  }

  function exec(_x3) {
    return _exec.apply(this, arguments);
  }

  function _exec() {
    _exec = _asyncToGenerator(function* (p) {
      if (run >= max) {
        return setNextParam(p);
      }

      run++; //获取上次执行到现在缓存的结束函数

      const end = getEndFunc(); //执行函数

      let ret,
          error = false;

      try {
        ret = yield f.call(...p);
      } catch (e) {
        ret = e;
        error = true;
      } //返回函数


      for (let f of end) {
        f[error ? 1 : 0](ret);
      }

      run--; //获取下一轮参数

      const next = getNextParam();

      if (next) {
        return exec(next);
      }
    });
    return _exec.apply(this, arguments);
  }

  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (...p) {
        return new Promise((f1, f2) => {
          end.push([f1, f2]);
          exec([this, ...p]);
        });
      });

      return function (_x4) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
}
//# sourceMappingURL=funcctrl.js.map
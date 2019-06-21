function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/** 基本操作信息 */

/** 操作对象 */

/** 操作类型 */

/**
 * 处理方法
 */
let methods = {};
let execHook;
/**
 * 设置执行钩子
 * @param hook 执行钩子
 */

export function setHook(hook) {
  execHook = hook;
}
/**
 * 执行操作函数(执行操作)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj 要执行的操作
 */

function execOperFunc(methodName, funcName, def, ...args) {
  if (!(methodName in methods)) {
    return def;
  }

  const method = methods[methodName];
  const func = method[funcName];

  if (!func) {
    return def;
  }

  try {
    return func.call(method, ...args);
  } catch (e) {
    return def;
  }
} //文本参数一览表


let operation = {};
/**
 * 比较两个操作是否相同
 * @param obj1 要比价的操作
 * @param obj2 要比较的操作
 */

export function compare(a, b) {
  a = parse(a);

  if (!(a && typeof a === 'object')) {
    return false;
  }

  b = parse(b);

  if (!(b && typeof b === 'object')) {
    return false;
  }

  if (a.method !== b.method) {
    return false;
  }

  return Boolean(execOperFunc(a.method, 'compare', false, a, b));
}
/**
 * 操作规范化
 * @param obj 要规范化的操作
 */

export function normalize(oper) {
  //获取参数对象
  oper = parse(oper);

  if (!(oper && oper instanceof Object)) {
    return;
  }

  let {
    method,
    replace,
    execTip,
    execTitle
  } = oper;

  if (!(method in methods)) {
    return;
  }

  oper = Object.assign({}, oper);
  delete oper.execTip;
  delete oper.execTitle;
  oper = execOperFunc(method, 'normalize', oper, oper);

  if (!oper) {
    return;
  }

  oper.method = method;

  if (replace) {
    oper.replace = true;
  } else {
    delete oper.replace;
  }

  if (execTip && typeof execTip === 'string') {
    oper.execTip = execTip;

    if (execTitle && typeof execTitle === 'string') {
      oper.execTitle = execTitle;
    }
  }

  return oper;
}
/**
 * 操作转为字符串
 * @param oper 要转为字符串的操作
 */

export function stringify(oper) {
  if (typeof oper === 'string') {
    return oper;
  }

  if (!(oper && typeof oper === 'object')) {
    return '';
  }

  let {
    method,
    replace
  } = oper;

  if (!(method && typeof method === 'string')) {
    return '';
  }

  oper = execOperFunc(method, 'stringify', '', oper);

  if (typeof oper !== 'string') {
    return '';
  }

  if (method !== 'exec') {
    oper = oper ? method + ':' + oper : ':' + oper;
  }

  if (oper && replace && oper[0] !== '@') {
    oper = '@' + oper;
  }

  return oper;
}
/**
 * 获取实际参数对象
 * @param   oper 文本型参数
 */

export function parse(oper) {
  if (typeof oper !== 'string') {
    return oper;
  }

  let replace = false,
      method = '';

  if (oper[0] == '@') {
    replace = true;
    oper = oper.substr(1);
  }

  while (oper[0] == '@') {
    oper = oper.substr(1);
  }

  if (oper.indexOf(':') !== -1) {
    let i = oper.indexOf(':');
    let v = decodeURIComponent(oper.substr(i + 1));
    let k = decodeURIComponent(oper.substr(0, i));

    if (!k) {
      k = v;
      v = '';
    }

    method = k;
    oper = execOperFunc(method, 'parse', undefined, v);
  } else if (oper in operation) {
    oper = operation[oper];
  }

  if (!(oper && typeof oper === 'object')) {
    return;
  }

  if (method) {
    oper.method = method;
  }

  if (replace) {
    oper.replace = replace;
  }

  return oper;
}
/**
 * 执行路由参数
 * @param oper 参数
 */

export function exec(_x) {
  return _exec.apply(this, arguments);
}
/**
 * 测试操作是否合法
 * @param oper 要测试的参数
 */

function _exec() {
  _exec = _asyncToGenerator(function* (oper) {
    //获取参数对象
    oper = parse(oper);

    if (!(oper && oper instanceof Object)) {
      return false;
    }

    let {
      method
    } = oper;

    if (!(method in methods)) {
      return false;
    }

    if (typeof execHook === 'function' && !(yield execHook(oper))) {
      return false;
    }

    return Boolean((yield execOperFunc(method, 'exec', false, oper)));
  });
  return _exec.apply(this, arguments);
}

export function test(oper) {
  oper = parse(oper);

  if (!(oper && oper instanceof Object)) {
    return false;
  }

  let method = oper.method;

  if (!(method in methods)) {
    return false;
  }

  return Boolean(execOperFunc(method, 'test', true, oper));
}
/**
 * 设置操作
 * @param id 操作id
 * @param o 操作数据
 */

export function setOperation(id, o) {
  if (!(id && typeof id === 'string')) {
    return;
  }

  if (!(o && typeof o === 'object')) {
    return;
  }

  operation[id] = o;
}
/**
 * 清除全部操作
 */

export function clearOperation(id) {
  if (!(id && typeof id === 'string')) {
    operation = {};
  } else {
    delete operation[id];
  }
}
/**
 * 设置解析方法
 * @param id 方法名称
 * @param param 配置
 */

export function setMethod(id, {
  exec,
  test,
  compare,
  parse,
  stringify,
  normalize
}) {
  if (!(id && typeof id === 'string')) {
    return;
  }

  if (typeof exec !== 'function') {
    return;
  }

  methods[id] = {
    exec: exec,
    test: typeof test === 'function' && test || undefined,
    compare: typeof compare === 'function' && compare || undefined,
    parse: typeof parse === 'function' && parse || undefined,
    stringify: typeof stringify === 'function' && stringify || undefined,
    normalize: typeof normalize === 'function' && normalize || undefined
  };
}
/**
 * 清除所有解析方法
 */

export function clearMethod(id) {
  if (!(id && typeof id === 'string')) {
    methods = {};
    return;
  }

  delete methods[id];
}

/** 命令操作 */
export const cmdMethod = {
  exec({
    exec: e,
    replace
  }) {
    return _asyncToGenerator(function* () {
      if (!e) {
        return false;
      }

      if (typeof e === 'string') {
        return exec(replace ? '@' + e : e);
      }

      e.replace = e.replace || replace;
      return exec(e);
    })();
  },

  test({
    exec: e
  }) {
    return test(e);
  },

  parse(exec) {
    if (exec) {
      return;
    }

    return parse(exec);
  },

  stringify({
    exec
  }) {
    return stringify(exec);
  },

  normalize({
    exec,
    replace
  }) {
    exec = normalize(exec);

    if (exec && replace) {
      exec.replace = replace;
    }

    return exec;
  }

};
//# sourceMappingURL=cmd.js.map
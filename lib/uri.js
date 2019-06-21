function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let uriScheme = {};
/**
 * 获取 URL Scheme
 * @param uri 要获取 Scheme 的 URI
 */

function getUriScheme(uri) {
  if (!uri) {
    return '';
  }

  let [, s] = /^([a-z\-\+0-9\.]+)\:/i.exec(uri) || [, ''];
  return s.toLowerCase();
}
/**
 * 设置 URI 处理方法
 * @param scheme
 */


export function set(scheme, {
  open,
  test
}) {
  if (!(scheme && typeof scheme === 'string')) {
    return false;
  }

  if (!(typeof open === 'function')) {
    return false;
  }

  [, scheme] = /^([a-z\-\+0-9\.]+)\:?$/i.exec(scheme) || [, ''];

  if (!scheme) {
    return false;
  }

  if (!(typeof test === 'function')) {
    test = undefined;
  }

  uriScheme[scheme.toLowerCase()] = {
    open,
    test
  };
  return true;
}
export function clean(scheme) {
  if (!(scheme && typeof scheme === 'string')) {
    return;
  }

  delete uriScheme[scheme];
}
/**
 * 打开 URL
 */

export function open(_x, _x2) {
  return _open.apply(this, arguments);
}
/**
 * 测试 URL 是否被支持
 */

function _open() {
  _open = _asyncToGenerator(function* (uri, replace) {
    let schemeName = getUriScheme(uri);

    if (!(schemeName && schemeName in uriScheme)) {
      return false;
    }

    let scheme = uriScheme[schemeName];
    return Boolean((yield scheme.open(uri, replace)));
  });
  return _open.apply(this, arguments);
}

export function test(uri) {
  let schemeName = getUriScheme(uri);

  if (!(schemeName && schemeName in uriScheme)) {
    return false;
  }

  let scheme = uriScheme[schemeName];
  return Boolean(!scheme.test || scheme.test(uri));
}

function getUri(url) {
  return url || '';
}

export const uriMethod = {
  exec({
    uri,
    replace,
    url
  }) {
    return _asyncToGenerator(function* () {
      uri = uri || url;

      if (!uri) {
        return false;
      }

      return open(uri, replace);
    })();
  },

  test({
    uri,
    url
  }) {
    uri = uri || url;

    if (!uri) {
      return false;
    }

    return test(uri || url);
  },

  compare(a, b) {
    return getUri(a.uri || a.url) === getUri(b.uri || b.url) && Boolean(a.replace) === Boolean(b.replace);
  },

  parse(uri) {
    if (uri) {
      return {
        uri
      };
    }
  },

  stringify({
    uri,
    url
  }) {
    return uri || url || '';
  },

  normalize({
    uri,
    replace,
    url
  }) {
    return {
      replace,
      uri: getUri(uri || url)
    };
  }

};
//# sourceMappingURL=uri.js.map
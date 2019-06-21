/** 初始化状态存储 */
let initState = Promise.resolve();
/** 是否已初始化 */

let inited = false;
/** 进行初始化，并返回是否可以继续执行 */

/** 进行初始化，并返回是否可以继续执行 */
function init(item) {
  if (item === true) {
    return initState.then(() => inited = true);
  }

  if (item) {
    initState = initState.then(_ => typeof item === 'function' ? item() : item).catch(() => true);
    return initState.then(() => inited = true);
    ;
  }

  if (inited) {
    return true;
  }

  if (typeof init.uninitHandle === 'function') {
    try {
      init.uninitHandle();
    } catch (e) {}
  }

  return false;
}

init.uninitHandle = undefined;
export default init;
//# sourceMappingURL=init.js.map
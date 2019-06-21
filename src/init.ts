/** 初始化状态存储 */
let initState = Promise.resolve();
/** 是否已初始化 */
let inited = false;

/** 进行初始化，并返回是否可以继续执行 */
function init(): boolean;
/** 等待初始化完成 */
function init(wait: true): Promise<true>;
/** 添加初始函数 */
function init(item: (() => Promise<any> | any) | Promise<any>): Promise<true>;
/** 进行初始化，并返回是否可以继续执行 */
function init(item?: true | (() => Promise<any> | any) | Promise<any>): boolean | Promise<true> {
	if (item === true) { return initState.then<true>(() => inited = true); }
	if (item) {
		initState = initState
			.then(_ => typeof item === 'function' ? item() : item)
			.catch(() => true);
		return initState.then<true>(() => inited = true);;
	}
	if (inited) { return true; }
	if (typeof init.uninitHandle === 'function') {
		try { init.uninitHandle(); } catch(e){}
	}
	return false;
}
init.uninitHandle = undefined as undefined | (() => any);

export default init as {
	/** 进行初始化，并返回是否可以继续执行 */
	(): boolean;
	/** 等待初始化完成 */
	(wait: true): Promise<true>;
	/** 添加初始函数 */
	(item: (() => Promise<any> | any) | Promise<any>): Promise<true>;
	/** 未初始化时调用的方法 */
	uninitHandle: undefined | (() => any);
};

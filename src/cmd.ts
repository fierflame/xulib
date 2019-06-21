/** 基本操作信息 */
export interface BaseOperObject {
	/** 方法名 */
	method?: string;
	/** 是否替换当前页面 */
	replace?: boolean;
	/** 执行提示 */
	execTip?: string;
	/** 执行提示标题 */
	execTitle?: string;
	[key: string]: any;
}
/** 操作对象 */
export interface OperObject extends BaseOperObject {
	method: string;
}
/** 操作类型 */
export type Oper = OperObject | string | undefined;

/**
 * 处理方法
 */
export interface Method {
	/**
	 * 执行操作
	 * @param obj 要执行的操作
	 */
	exec(this: Method, obj: BaseOperObject): Promise<boolean>;
	/**
	 * 测试操作是否合法
	 * @param obj 要测试的操作
	 */
	test?(this: Method, obj: BaseOperObject): boolean;
	/**
	 * 比较两个操作是否相同
	 * @param obj1 要比价的操作
	 * @param obj2 要比较的操作
	 */
	compare?(this: Method, obj1: BaseOperObject, obj2: BaseOperObject): boolean;
	/**
	 * 解析操作字符串
	 * @param s 要解析的操作字符串
	 */
	parse?(this: Method, s: string): BaseOperObject | undefined;
	/**
	 * 操作转为字符串
	 * @param obj 要转为字符串的操作
	 */
	stringify?(this: Method, obj: BaseOperObject): string;
	/**
	 * 操作规范化
	 * @param obj 要规范化的操作
	 */
	normalize?(this: Method, obj: BaseOperObject): BaseOperObject | undefined;
}
let methods = {};
let execHook: ((oper: OperObject) => Promise<boolean> | boolean) | undefined;
/**
 * 设置执行钩子
 * @param hook 执行钩子
 */
export function setHook(hook: ((oper: OperObject) => Promise<boolean> | boolean) | undefined) {
	execHook = hook;
}
/**
 * 执行操作函数(执行操作)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj 要执行的操作
 */
function execOperFunc(methodName: string, funcName: 'exec', def: boolean | Promise<boolean>, obj: OperObject): boolean | Promise<boolean>;
/**
 * 执行操作函数(测试操作是否合法)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj 要测试的操作
 */
function execOperFunc(methodName: string, funcName: 'test', def: boolean, obj: OperObject): boolean;
/**
 * 执行操作函数(比较两个操作是否相同)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj1 要比价的操作
 * @param obj2 要比较的操作
 */
function execOperFunc(methodName: string, funcName: 'compare', def: boolean, obj1: OperObject, obj2: OperObject): boolean;
/**
 * 执行操作函数(解析操作字符串)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param s 要解析的操作字符串
 */
function execOperFunc(methodName: string, funcName: 'parse', def: OperObject | undefined, s: string): OperObject | undefined;
/**
 * 执行操作函数(操作转为字符串)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj 要转为字符串的操作
 */
function execOperFunc(methodName: string, funcName: 'stringify', def: string, obj: OperObject): string;
/**
 * 执行操作函数(操作规范化)
 * @param methodName 方法名
 * @param funcName 执行名称
 * @param def 默认返回值
 * @param obj 要规范化的操作
 */
function execOperFunc(methodName: string, funcName: 'normalize', def: OperObject, obj: OperObject): OperObject | undefined;
function execOperFunc<F extends keyof Method>(methodName: string, funcName: F, def: Method[F], ...args: any[]): Method[F] {
	if (!(methodName in methods)) { return def; }
	const method = methods[methodName];
	const func = method[funcName];
	if (!func) {return def; }
	try {
		return func.call(method, ...args);
	} catch(e) {
		return def;
	}

}

//文本参数一览表
let operation:{[key:string]: OperObject} = {}

/**
 * 比较两个操作是否相同
 * @param obj1 要比价的操作
 * @param obj2 要比较的操作
 */
export function compare(a: Oper, b: Oper): boolean {
	a = parse(a);
	if (!(a && typeof a === 'object')) { return false; }
	b = parse(b);
	if (!(b && typeof b === 'object')) { return false; }
	if (a.method !== b.method) {return false;}

	return Boolean(execOperFunc(a.method, 'compare', false, a, b));
}

/**
 * 操作规范化
 * @param obj 要规范化的操作
 */
export function normalize(oper: Oper): OperObject | undefined {
	//获取参数对象
	oper = parse(oper);
	if (!(oper && oper instanceof Object)) { return; }

	let {method, replace, execTip, execTitle, } = oper;
	if (!(method in methods)) { return; }

	oper = Object.assign({}, oper);
	delete oper.execTip; delete oper.execTitle;

	oper = execOperFunc(method, 'normalize', oper, oper);
	if (!oper) { return; }

	oper.method = method;
	if (replace) { oper.replace = true; }
	else { delete oper.replace; }

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
export function stringify(oper: Oper): string {
	if (typeof oper === 'string') { return oper; }
	if (!(oper && typeof oper === 'object')) { return ''; }
	let { method, replace } = oper;
	if (!(method && typeof method === 'string')) { return ''; }

	oper = execOperFunc(method, 'stringify', '', oper);

	if (typeof oper !== 'string') { return ''; }
	if (method !== 'exec') { oper = oper ? method + ':' + oper : ':' + oper;}
	if (oper && replace && oper[0] !== '@') {oper = '@' + oper;}
	return oper;
}

/**
 * 获取实际参数对象
 * @param   oper 文本型参数
 */
export function parse(oper: Oper): OperObject | undefined {
	if (typeof oper !== 'string') { return oper;}
	let replace: boolean = false, method: string = '';

	if (oper[0] == '@') { replace = true; oper = oper.substr(1); }
	while (oper[0] == '@') { oper = oper.substr(1); }
	if (oper.indexOf(':') !== -1) {
		let i = oper.indexOf(':');
		let v = decodeURIComponent(oper.substr(i + 1));
		let k = decodeURIComponent(oper.substr(0, i));
		if (!k) { k = v; v = ''; }

		method = k;
		oper = execOperFunc(method, 'parse', undefined, v);
	} else if (oper in operation) {
		oper = operation[oper];
	}
	if (!(oper && typeof oper === 'object')) { return; }
	if (method) { oper.method = method;}
	if (replace) { oper.replace = replace;}
	return oper;
}

/**
 * 执行路由参数
 * @param oper 参数
 */
export async function exec(oper: Oper): Promise<boolean> {
	//获取参数对象
	oper = parse(oper);
	if (!(oper && oper instanceof Object)) { return false; }
	let { method } = oper;
	if (!(method in methods)) { return false; }
	if (typeof execHook === 'function' && !await execHook(oper)) {
		return false;
	}
	return Boolean(await execOperFunc(method, 'exec', false, oper));
}

/**
 * 测试操作是否合法
 * @param oper 要测试的参数
 */
export function test(oper: Oper): boolean {
	oper = parse(oper);
	if (!(oper && oper instanceof Object)) { return false; }
	let method = oper.method;
	if (!(method in methods)) { return false; }

	return Boolean(execOperFunc(method, 'test', true, oper));
}



/**
 * 设置操作
 * @param id 操作id
 * @param o 操作数据
 */
export function setOperation(id: string, o: OperObject): void {
	if (!(id && typeof id === 'string')) { return; }
	if (!(o && typeof o === 'object')) { return; }
	operation[id] = o;
}

/**
 * 清除全部操作
 */
export function clearOperation(): void;
/**
 * 清除指定操作
 * @param id 操作id
 */
export function clearOperation(id: string): void;
export function clearOperation(id?: string): void {
	if (!(id && typeof id === 'string')) {
		operation =  {};
	} else {
		delete operation[id];
	}
}
/**
 * 设置解析方法
 * @param id 方法名称
 * @param param 配置
 */
export function setMethod(id: string, {exec, test, compare, parse, stringify, normalize}: Method): void {
	if (!(id && typeof id === 'string')) { return; }
	if (typeof exec !== 'function') { return; }
	methods[id] = {
		exec:		exec,
		test:		typeof test === 'function' && test || undefined,
		compare:	typeof compare === 'function' && compare || undefined,
		parse:		typeof parse === 'function' && parse || undefined,
		stringify:	typeof stringify === 'function' && stringify || undefined,
		normalize:	typeof normalize === 'function' && normalize || undefined,
	};
}
/**
 * 清除所有解析方法
 */
export function clearMethod(): void;
/**
 * 清除指定的解析方法
 * @param id 方法名称
 */
export function clearMethod(id: string): void;
export function clearMethod(id?: string): void {
	if (!(id && typeof id === 'string')) {
		methods = {};
		return;
	}
	delete methods[id];
}


export interface CmdOper extends BaseOperObject {
	/** 操作信息 */
	exec: Oper;
}
/** 命令操作 */
export const cmdMethod: Method = {
	async exec({ exec: e, replace }: CmdOper): Promise<boolean> {
		if (!e) { return false; }
		if (typeof e === 'string') {
			return exec(replace ? '@' + e : e);
		}
		e.replace = e.replace || replace;
		return exec(e);
	},
	test({ exec: e }: CmdOper):boolean {
		return test(e);
	},
	parse(exec: string): OperObject | undefined {
		if (exec) { return; }
		return parse(exec);
	},
	stringify({ exec }: CmdOper): string {
		return stringify(exec);
	},
	normalize({ exec, replace }: CmdOper): OperObject | undefined {
		exec = normalize(exec);
		if (exec && replace) {
			exec.replace = replace;
		}
		return exec as OperObject;
	},
}

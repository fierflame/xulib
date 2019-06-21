/** 封装成只会执行一次的函数，封装后函数，只会返回第一次执行时得到的结果(包括抛出的错误) */
export function once<T, F, R>(f: (this: T, ...p: F[]) => R): (this: any, ...p: any[]) => R | undefined {
	let run = false;
	let error = false;
	let ret: R;
	return function(this: T, ...p: F[]): R {
		if (run) {
			if (error) { throw ret; }
			return ret;
		}
		run = true;
		try {
			return ret = f.call(this, ...p);
		} catch(e) {
			error = true;
			ret = e;
			throw ret;
		}
	}
}
/** 封装成合并执行的函数，封装后函数永远返回Promise，上次执行时得到的Promise未结束前，返回的将会是同一个Promise */
export function merge<T, P extends any[], R>(f: (this: T, ...argv: P) => R | Promise<R>): (this: T, ...argv: P) => Promise<R | undefined> {
	let ret: Promise<R> | R | undefined;
	return async function (this: T, ...argv: P): Promise<R | undefined> {
		if (ret) { return ret; }
		try {
			ret = f.call(this, ...argv);
			return await ret;
		} finally {
			ret = undefined;
		}
	}
}
/** 封装成执行队列，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余执行将会加入队列，直到有Promise完成 */
export function queue<T, P extends any[], R>(f: (this: T, ...argv: P) => R | Promise<R>, max?: number): ((this: T, ...argv: P) => Promise<R>);
export function queue<T, P extends any[], R>(f: ((this: T, ...argv: P) => R | Promise<R>)[], max?: number): (((this: T, ...argv: P) => Promise<R>) | undefined)[];
export function queue<T, P extends any[], R>(
	f: ((this: T, ...argv: P) => R | Promise<R>) | ((this: T, ...argv: P) => R | Promise<R>)[],
	max: number = 1
): ((this: T, ...argv: P) => Promise<R>) | (((this: T, ...argv: P) => Promise<R>) | undefined)[] | undefined {
	const queue: ((...p: any[]) => void)[] = [];
	let wait: number = 0;
	function next(): void {
		if (queue.length) {
			(queue.shift() as ((...p: any[]) => void))();
		} else {
			wait--;
		}
	}
	function getRunStatus(): Promise<void> {
		return new Promise(r => wait < max ? r(void wait++) : queue.push(r));
	}
	function get(f: (this: T, ...argv: P) => R | Promise<R>): (this: T, ...argv: P) => Promise<R> {
		return async function (this: T, ...argv: P): Promise<R> {
			try {
				await getRunStatus();
				return await f.call(this, ...argv);
			} finally {
				next();
			}
		}
	}
	if (typeof f === 'function') {
		return get(f);
	} else if (Array.isArray(f)) {
		return f.map(f => typeof f === 'function' ? undefined : get(f));
	}
}
/** 封装成忽略性执行，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余只保留最后一个，担有一个Promise完成，执行最后一次参数 */
export function ignore<T, P, R>(f: (this: T, ...argv: P[]) => R | Promise<R>, max: number = 1): (this: T, ...argv: P[]) => Promise<R> {
	type PromiseBackCall = [(value?: R | PromiseLike<R>) => void, (reason?: any) => void];
	type Param = [T, ...P[]];
	let run: number = 0;
	let next: Param | undefined;
	let end: PromiseBackCall[] = [];
	function getEndFunc(): PromiseBackCall[] {
		let e: PromiseBackCall[] = end;
		end = [];
		return e;
	}
	function getNextParam() {
		let p = next;
		next = undefined;
		return p;
	}
	function setNextParam(p: Param): void {
		next = p;
	}
	async function exec(p: Param) {
		if (run >= max) {
			return setNextParam(p);
		}
		run++;
		//获取上次执行到现在缓存的结束函数
		const end: PromiseBackCall[] = getEndFunc();
		//执行函数
		let ret: R, error = false;
		try {
			ret = await f.call(...p);
		} catch (e) {
			ret = e;
			error = true;
		}
		//返回函数
		for (let f of end) {
			f[error ? 1 : 0](ret);
		}
		run--;
		//获取下一轮参数
		const next: Param | undefined = getNextParam();
		if (next) {
			return exec(next);
		}
	}
	return async function (this: T, ...p: P[]) {
		return new Promise((f1, f2) => {end.push([f1, f2]); exec([this, ...p]);});
	}
}

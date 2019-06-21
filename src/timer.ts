/** 计时器 */
class Timer {
	//暂停状态
	_pausing = false;
	//暂停开始时间
	_pause = 0;
	//已暂停时间
	_paused = 0;
	//初始化时间
	_begin = 0;
	constructor() {
		this._pausing = false;
		this._pause = 0;
		this._paused = 0;
		this._begin = Timer.getTime();
	}
	static async next<T, P, R>(this: T, f: (this: T, r: (value?: R | PromiseLike<R>) => void, ...p: P[]) => any, ...p: P[]): Promise<R> {
		return new Promise(r => f.call(this, r, ...p));
	}
	static nextRescissible<T, I, P, R>(this: T, f: (this: T, r: (value?: R | PromiseLike<R>) => I, ...p: P[]) => any, c: (t: I) => void, ...p: P[]): Promise<R> & { cancel(error?: any): void} {
		let canceled = false;
		let cancelError = undefined;
		let cancel: undefined | ((error?: any) => void) = undefined;
		const next = new Promise((resolve, reject) => {
			if (canceled) { return cancelError === undefined ? resolve() : reject(cancelError); }
			const t = f.call(this, () => {
				canceled = true;
				resolve();
			}, ...p);
			cancel = (error?: any) => {
				if (canceled) { return; }
				canceled = true;
				c(t);
				return error === undefined ? resolve() : reject(error);
			}
		}) as Promise<R> & { cancel(error?: any): void};
		next.cancel = (error?: any) => {
			if (canceled) { return; }
			if (cancel) { cancel(error); }
			cancelError = error;
			canceled = true;
		}
		return next;
	}
	/** 延时 */
	static delayed(ms: number): Promise<void> & { cancel(error?: any): void} {
		return Timer.nextRescissible(f => setTimeout(f, ms), clearTimeout);
	}
	/** 等待进入下一帧渲染 */
	static async nextFrame(gl: Window): Promise<void> {
		return Timer.nextRescissible(gl.requestAnimationFrame.bind(gl), gl.cancelAnimationFrame.bind(gl));
	}
	/** 获取当前时间 */
	static getTime(): number {
		try {
			return performance.now();
		} catch (e) { }
		return +new Date();
	}
	/** 继续计时 */
	run(): void {
		if (!this._pausing) {
			return ;
		}
		this._pausing = false;
		this._paused += Timer.getTime() - this._pause;
	}
	/** 暂停计时 */
	pause(): void {
		if (this._pausing) {
			return ;
		}
		this._pausing = true;
		this._pause = Timer.getTime();
	}
	/** 已暂停时间 */
	get paused(): number {
		return this._paused + (this._pausing ? Timer.getTime() - this._pause : 0);
	}
	/** 已经执行时间 */
	get time(): number {
		return (this._pausing ? this._pause : Timer.getTime()) - this._begin - this._paused;
	}
	/** 获取已经执行时间 */
	get() {
		return this.time;
	}
}
export default Timer;

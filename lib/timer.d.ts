/** 计时器 */
declare class Timer {
    _pausing: boolean;
    _pause: number;
    _paused: number;
    _begin: number;
    constructor();
    static next<T, P, R>(this: T, f: (this: T, r: (value?: R | PromiseLike<R>) => void, ...p: P[]) => any, ...p: P[]): Promise<R>;
    static nextRescissible<T, I, P, R>(this: T, f: (this: T, r: (value?: R | PromiseLike<R>) => I, ...p: P[]) => any, c: (t: I) => void, ...p: P[]): Promise<R> & {
        cancel(error?: any): void;
    };
    /** 延时 */
    static delayed(ms: number): Promise<void> & {
        cancel(error?: any): void;
    };
    /** 等待进入下一帧渲染 */
    static nextFrame(gl: Window): Promise<void>;
    /** 获取当前时间 */
    static getTime(): number;
    /** 继续计时 */
    run(): void;
    /** 暂停计时 */
    pause(): void;
    /** 已暂停时间 */
    readonly paused: number;
    /** 已经执行时间 */
    readonly time: number;
    /** 获取已经执行时间 */
    get(): number;
}
export default Timer;

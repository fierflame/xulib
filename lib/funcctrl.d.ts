/** 封装成只会执行一次的函数，封装后函数，只会返回第一次执行时得到的结果(包括抛出的错误) */
export declare function once<T, F, R>(f: (this: T, ...p: F[]) => R): (this: any, ...p: any[]) => R | undefined;
/** 封装成合并执行的函数，封装后函数永远返回Promise，上次执行时得到的Promise未结束前，返回的将会是同一个Promise */
export declare function merge<T, P extends any[], R>(f: (this: T, ...argv: P) => R | Promise<R>): (this: T, ...argv: P) => Promise<R | undefined>;
/** 封装成执行队列，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余执行将会加入队列，直到有Promise完成 */
export declare function queue<T, P extends any[], R>(f: (this: T, ...argv: P) => R | Promise<R>, max?: number): ((this: T, ...argv: P) => Promise<R>);
export declare function queue<T, P extends any[], R>(f: ((this: T, ...argv: P) => R | Promise<R>)[], max?: number): (((this: T, ...argv: P) => Promise<R>) | undefined)[];
/** 封装成忽略性执行，封装后函数永远返回Promise，确保同时执行的函数不超过 max 个，多余只保留最后一个，担有一个Promise完成，执行最后一次参数 */
export declare function ignore<T, P, R>(f: (this: T, ...argv: P[]) => R | Promise<R>, max?: number): (this: T, ...argv: P[]) => Promise<R>;

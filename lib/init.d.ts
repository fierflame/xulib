declare const _default: {
    (): boolean;
    (wait: true): Promise<true>;
    (item: Promise<any> | (() => any)): Promise<true>;
    /** 未初始化时调用的方法 */
    uninitHandle: (() => any) | undefined;
};
export default _default;

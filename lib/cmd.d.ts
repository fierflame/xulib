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
export declare type Oper = OperObject | string | undefined;
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
/**
 * 设置执行钩子
 * @param hook 执行钩子
 */
export declare function setHook(hook: ((oper: OperObject) => Promise<boolean> | boolean) | undefined): void;
/**
 * 比较两个操作是否相同
 * @param obj1 要比价的操作
 * @param obj2 要比较的操作
 */
export declare function compare(a: Oper, b: Oper): boolean;
/**
 * 操作规范化
 * @param obj 要规范化的操作
 */
export declare function normalize(oper: Oper): OperObject | undefined;
/**
 * 操作转为字符串
 * @param oper 要转为字符串的操作
 */
export declare function stringify(oper: Oper): string;
/**
 * 获取实际参数对象
 * @param   oper 文本型参数
 */
export declare function parse(oper: Oper): OperObject | undefined;
/**
 * 执行路由参数
 * @param oper 参数
 */
export declare function exec(oper: Oper): Promise<boolean>;
/**
 * 测试操作是否合法
 * @param oper 要测试的参数
 */
export declare function test(oper: Oper): boolean;
/**
 * 设置操作
 * @param id 操作id
 * @param o 操作数据
 */
export declare function setOperation(id: string, o: OperObject): void;
/**
 * 清除全部操作
 */
export declare function clearOperation(): void;
/**
 * 清除指定操作
 * @param id 操作id
 */
export declare function clearOperation(id: string): void;
/**
 * 设置解析方法
 * @param id 方法名称
 * @param param 配置
 */
export declare function setMethod(id: string, { exec, test, compare, parse, stringify, normalize }: Method): void;
/**
 * 清除所有解析方法
 */
export declare function clearMethod(): void;
/**
 * 清除指定的解析方法
 * @param id 方法名称
 */
export declare function clearMethod(id: string): void;
export interface CmdOper extends BaseOperObject {
    /** 操作信息 */
    exec: Oper;
}
/** 命令操作 */
export declare const cmdMethod: Method;

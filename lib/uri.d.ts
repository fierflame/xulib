export interface Method {
    open(this: Method, uri: string, replace?: boolean): Promise<boolean>;
    test?(this: Method, uri: string): boolean;
}
/**
 * 设置 URI 处理方法
 * @param scheme
 */
export declare function set(scheme: string, { open, test }: Method): boolean;
export declare function clean(scheme: string): void;
/**
 * 打开 URL
 */
export declare function open(uri?: string, replace?: boolean): Promise<boolean>;
/**
 * 测试 URL 是否被支持
 */
export declare function test(uri?: string): boolean;
import { BaseOperObject, Method as CmdMethod } from './cmd';
export interface UriOperLike extends BaseOperObject {
    uri?: string;
    url?: string;
}
export interface UriOper extends BaseOperObject {
    uri: string;
}
export declare const uriMethod: CmdMethod;

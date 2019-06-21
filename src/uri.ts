export interface Method {
	open(this: Method, uri: string, replace?: boolean): Promise<boolean>;
	test?(this: Method, uri: string): boolean;
}

type test = (uri: string) => boolean;

let uriScheme: { [key: string]: Method } = {};
/**
 * 获取 URL Scheme
 * @param uri 要获取 Scheme 的 URI
 */
function getUriScheme(uri?: string): string {
	if (!uri) { return ''; }
	let [, s] = /^([a-z\-\+0-9\.]+)\:/i.exec(uri) || [, ''];
	return s.toLowerCase();
}
/**
 * 设置 URI 处理方法
 * @param scheme
 */
export function set(scheme: string, { open, test }: Method): boolean {
	if (!(scheme && typeof scheme === 'string')) { return false; }
	if (!(typeof open === 'function')) { return false; }
	[, scheme] = /^([a-z\-\+0-9\.]+)\:?$/i.exec(scheme) || [, ''];
	if (!scheme) {return false;}
	if (!(typeof test === 'function')) { test = undefined; }
	uriScheme[scheme.toLowerCase()] = {open, test};
	return true;
}

export function clean(scheme: string): void {
	if (!(scheme && typeof scheme === 'string')) { return; }
	delete uriScheme[scheme];
}

/**
 * 打开 URL
 */
export async function open(uri?: string, replace?: boolean): Promise<boolean> {
	let schemeName = getUriScheme(uri);
	if (!(schemeName && schemeName in uriScheme)) { return false; }
	let scheme = uriScheme[schemeName];
	return Boolean(await scheme.open(uri as string, replace));
}
/**
 * 测试 URL 是否被支持
 */
export function test(uri?: string): boolean {
	let schemeName = getUriScheme(uri);
	if (!(schemeName && schemeName in uriScheme)) { return false; }
	let scheme = uriScheme[schemeName];
	return Boolean(!scheme.test || scheme.test(uri as string));
}
function getUri(url?: string): string {
	return url || '';
}

import { BaseOperObject, Method as CmdMethod } from './cmd';
export interface UriOperLike extends BaseOperObject {
	uri?: string;
	url?: string;
}
export interface UriOper extends BaseOperObject {
	uri: string;
}

export const uriMethod: CmdMethod = {
	async exec({ uri, replace, url }: UriOperLike): Promise<boolean> {
		uri = uri || url;
		if (!uri) { return false; }
		return open(uri, replace);
	},
	test({ uri, url }: UriOperLike): boolean {
		uri = uri || url;
		if (!uri) { return false; }
		return test(uri || url);
	},
	compare(a: UriOperLike, b: UriOperLike): boolean {
		return getUri(a.uri || a.url) === getUri(b.uri || b.url) && Boolean(a.replace) === Boolean(b.replace);
	},
	parse(uri: string): UriOper | undefined { 
		if (uri) {
			return {uri};
		}
	},
	stringify({ uri, url }: UriOperLike): string {
		return uri || url || '';
	},
	normalize({ uri, replace, url }: UriOperLike): UriOper | undefined {
		return { replace, uri: getUri(uri || url) };
	},
};
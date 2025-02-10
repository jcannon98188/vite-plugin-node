/**
 * modified from vitejs source code, just to make the console output looks vite-like
 */
import debug from "debug";

export function createDebugger(ns: string) {
	const log = debug(ns);
	return (msg: string, ...args: unknown[]) => {
		log(msg, ...args);
	};
}
export const queryRE = /\?.*$/;
export const hashRE = /#.*$/;

export const cleanUrl = (url: string) =>
	url.replace(hashRE, "").replace(queryRE, "");

// biome-ignore lint/suspicious/noExplicitAny: Function is a typeguard.
export function isObject(item: any): item is object {
	return item && typeof item === "object" && !Array.isArray(item);
}

export default function mergeDeep(target: object, source: object) {
	const output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		for (const key of Object.keys(source)) {
			// @ts-expect-error access unknow property
			if (isObject(source[key])) {
				if (!(key in target)) {
					// @ts-expect-error access unknow property
					Object.assign(output, { [key]: source[key] });
				} else {
					// @ts-expect-error access unknow property
					output[key] = mergeDeep(target[key], source[key]);
				}
			} else {
				// @ts-expect-error access unknow property
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
	return output;
}

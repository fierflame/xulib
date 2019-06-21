export function copyObject(base: Object | any[], to?: Object | any[]): Object | any[] | undefined {
	if (!to) {
		if (!base) { return base; }
		if (typeof base === 'function') { return; }
		if (base instanceof Array) { return base.map(x => copyObject(x)) }
		if (typeof base === 'object') {
			let ret = {};
			Object.keys(base).forEach(x => ret[x] = copyObject(base[x]));
			return ret;
		}
		return base;
	}
	if (!(base && typeof base === 'object')) { return; }
	if (!(to && typeof to === 'object')) { return; }
	if (to instanceof Array) {
		for (let i = 0; i < to.length; i++) {
			if (!(i in base)) { continue; }
			switch (typeof to[i]) {
				case 'string': 	to[i] = String(base[i]); break;
				case 'boolean': to[i] = Boolean(base[i]); break;
				case 'number': to[i] = Number(base[i]); break;
				case 'object': if (base) { copyObject(base[i], to[i]); } break;
			}
		}
		return;
	}
	for (let k in to) {
		if (!(k in base)) { continue; }
		switch (typeof to[k]) {
			case 'string': to[k] = String(base[k]); break;
			case 'boolean': to[k] = Boolean(base[k]); break;
			case 'number': to[k] = Number(base[k]); break;
			case 'object': if (base) { copyObject(base[k], to[k]); } break;
		}
	}
}

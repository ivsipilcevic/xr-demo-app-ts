// @ts-check

export function raw(key:string) {
	return {
		dangerouslySetInnerHTML: {
			__html: key,
		},
	};
}

/**
 * @param {string} path
 * @returns {string}
 */
export function tx(path:string, texts:{ [key:string]:any }) {
	if (texts) {
		const parts = path.split('.');
		let obj = texts;

		while (parts.length !== 0) {
			const part = parts.shift() || '';
			if (!obj[part]) return '';
			if (parts.length === 0) return obj[part];
			obj = obj[part];
		}
	}
	return '';
}

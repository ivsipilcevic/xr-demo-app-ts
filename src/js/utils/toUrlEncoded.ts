export function toUrlEncoded(object:Record<string, any>) {
	return Object.entries(object)
		.map(([key, value]:[key:string, value:string | number | boolean]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&');
}
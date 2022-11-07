/**
 * Returns the first element of an array
 * @param array
 * @returns {any} or null if not set
 */
export default function first<T>(array:T[]):T | null {
	if (array.length === 0) return null;
	return array[0];
}

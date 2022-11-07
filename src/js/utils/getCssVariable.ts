/**
 * Returns the current applied value of the specified css variable, returns an empty string `''` if not found or the element is not set
 * 
 * Don't forget to add the dashes `--`!
 */
export default function getCssVariable(el:HTMLElement, cssVar:string) {
	if (!el) return '';
	const val = getComputedStyle(el).getPropertyValue(cssVar);
	return val ? val.trim() : '';
}

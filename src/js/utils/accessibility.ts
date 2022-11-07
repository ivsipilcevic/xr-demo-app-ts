export const focusableTags = [
	'a[href]',
	'button:not([disabled])',
	'iframe',
	'video[controls]',
];

export const focusableSelectors = [
	'a[href]:not([tabindex^="-"])',
	'area[href]:not([tabindex^="-"])',
	'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
	'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked',
	'select:not([disabled]):not([tabindex^="-"])',
	'textarea:not([disabled]):not([tabindex^="-"])',
	'button:not([disabled]):not([tabindex^="-"])',
	'iframe:not([tabindex^="-"])',
	'audio[controls]:not([tabindex^="-"])',
	'video[controls]:not([tabindex^="-"])',
	'[contenteditable]:not([tabindex^="-"])',
	'[tabindex]:not([tabindex^="-"])',
];

export const keyboardKeys = {
	esc: 'Escape',
	tab: 'Tab',
};

export const getFocusableChildren = (root, selectors = focusableSelectors) => {
	const elements = [...root.querySelectorAll(selectors.join(','))];
  
	return elements.filter(element => element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

export const trapTabKey = (element:Element, event:KeyboardEvent) => {
	const focusableChildren = getFocusableChildren(element);
	const focusedItemIndex = focusableChildren.indexOf(document.activeElement);
	const lastIndex = focusableChildren.length - 1;
	const withShift = event.shiftKey;
	
	if (withShift && focusedItemIndex === 0) {
		focusableChildren[lastIndex].focus();
		event.preventDefault();
	} else if (!withShift && focusedItemIndex === lastIndex) {
		focusableChildren[0].focus();
		event.preventDefault();
	}
};

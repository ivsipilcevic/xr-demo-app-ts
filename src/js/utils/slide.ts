//@ts-check

import gsap, { Power1 } from 'gsap';
import { focusableTags, getFocusableChildren } from './accessibility';

export function toggleTabIndex(parent:HTMLElement) {
	const children = getFocusableChildren(parent, focusableTags);

	Array.from(children).forEach((element:HTMLElement) => {
		const getTabIndex = element.getAttribute('tabindex');

		if (getTabIndex) {
			const tabIndexValue = getTabIndex === '-1' ? '0' : '-1';
			element.setAttribute('tabindex', tabIndexValue);
		}
	});
}

export function slideUp(elem:HTMLElement, time = 0.3, ease = Power1.easeOut) {
	toggleTabIndex(elem);
	return new Promise((resolve) => {
		gsap.to(elem, {
			duration: time, height: 0, onComplete: resolve, ease,
		});
	});
}

export function slideDown(elem:HTMLElement, time = 0.3, ease = Power1.easeOut) {
	toggleTabIndex(elem);
	return new Promise((resolve) => {
		gsap.to(elem, {
			duration: time, height: elem.scrollHeight, onComplete: resolve, ease,
		});
	});
}

export function slideToggle(elem:HTMLElement, time = 0.3) {
	if (elem.getBoundingClientRect().height === 0) {
		return slideDown(elem, time);
	}

	return slideUp(elem, time);
}

export function toggleAriaExpended(elem:HTMLElement) {
	if (!elem.hasAttribute('aria-expanded')) return;
	const expanded = elem.getAttribute('aria-expanded') === 'true' || false;
	elem.setAttribute('aria-expanded', (!expanded).toString());
}

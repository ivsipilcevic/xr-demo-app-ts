import gsap, { Power2 } from 'gsap';
import offset from './offset';

const defaults = {
	offset: 0,
	duration: 0.9,
	delay: 0,
	container: (document.scrollingElement || document.documentElement),
	onUpdate: (() => {}) as (scrollY:number) => void,
	onComplete: () => {},
};

type ScrollToOptions = Partial<typeof defaults> & Record<string, boolean | number | string | Element>;

/**
 * Scrolls to position using gsap. If an offset is 
 * defined, scrolls that amount higher than the target element.
 */
export const scrollTo = (pos:number, options:ScrollToOptions = {}) => {
	const opt = Object.assign({}, defaults, options);

	const scroll = {
		y: opt.container.scrollTop,
	};

	gsap.to(scroll, {
		duration: opt.duration,
		y: pos + opt.offset,
		ease: (opt.ease || Power2.easeInOut) as string,
		onUpdate: () => {
			opt.container.scrollTop = scroll.y;
			opt.onUpdate(scroll.y);
		},
		delay: opt.delay,
		onComplete: opt.onComplete,
	});
};

/**
 * Scrolls to an element.
 */
export const scrollToElem = (el:Element, options:ScrollToOptions = {}) => {
	const opt = Object.assign({}, defaults, options);
	scrollTo(offset(el).top, opt);
};

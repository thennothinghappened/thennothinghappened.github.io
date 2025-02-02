import * as theme from './theme.mjs';
import { CardPopupManager } from '/js/lib/CardPopupManager.mjs';

const cardPopupManager = new CardPopupManager();

/** @type {HTMLElement} */
let main;

/** @type {HTMLElement} */
let navEntries;

export function initSharedContent() {

	main = document.querySelector('main');
	navEntries = document.querySelector('#navbar-entries');

	window.addEventListener('beforeunload', () => animatePageHide());
	window.addEventListener('pageshow', () => animatePageShow());
	
	cardPopupManager.init(main);
	theme.init();

	for (const anchor of document.querySelectorAll('a:not([href^="#"])')) {
		
		if (!(anchor instanceof HTMLAnchorElement)) {
			continue;
		}

		if (new URL(anchor.href).origin !== window.location.origin) {
			continue;
		}

		anchor.addEventListener('click', () => animateSameSiteHide());

	}

}

/**
 * @param {(event: KeyboardEvent) => void} callback 
 * @returns 
 */
export function key_enter_wrapper(callback) {
	/**
	 * @param {KeyboardEvent} event
	 */
	return function(event) {
		if (event.key === 'Enter') {
			callback(event);
		}
	}
}

/**
 * Fade out the page content on leaving the page.
 */
function animatePageHide() {
	main.classList.add('fadeout');
}

/**
 * Fade the content back in on showing a page.
 */
function animatePageShow() {
	
	if (main.classList.contains('fadeout')) {
		main.classList.remove('fadeout');
	}

	animateSameSiteShow();
	
}

/**
 * Begin the animation for switching to another in-site content tab.
 */
function animateSameSiteHide() {
	navEntries.scrollIntoView({ behavior: 'smooth' });
	localStorage.setItem('scroll-back-in', 'true');
}

/**
 * Finish the tab-switch animation on the receiving side.
 */
function animateSameSiteShow() {
	if (localStorage.getItem('scroll-back-in') === 'true') {
		localStorage.setItem('scroll-back-in', 'false');
		main.scrollIntoView({ behavior: 'smooth' });
	}
}

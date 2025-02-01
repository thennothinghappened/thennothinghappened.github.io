import * as theme from './theme.mjs';
import { CardPopupManager } from '/js/lib/CardPopupManager.mjs';

const cardPopupManager = new CardPopupManager();

export function initSharedContent() {

	/** @type { HTMLElement } */
	const navEntries = document.querySelector('#navbar-entries');

	/** @type {HTMLElement} */
	const main = document.querySelector('main');
	
	cardPopupManager.init(main);
	theme.init();

	for (const anchor of document.querySelectorAll('a')) {
		
		if (!(anchor instanceof HTMLAnchorElement)) {
			continue;
		}

		if (anchor.href.startsWith('#')) {
			continue;
		}

		anchor.addEventListener('click', () => {

			main.classList.add('fadeout');

			if (new URL(anchor.href).origin === window.location.origin) {
				navEntries.scrollIntoView({ behavior: 'smooth' });
				localStorage.setItem('scroll-back-in', (true).toString());
			}

		});

	}

	if (localStorage.getItem('scroll-back-in') === 'true') {
		localStorage.setItem('scroll-back-in', (false).toString());
		main.scrollIntoView({ behavior: 'smooth' });
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

import * as dialog from '/js/dialog.mjs';
import * as theme from '/js/theme.mjs';

/**
 * @typedef {HTMLDivElement & { content: HTMLElement }} ViewableCard
 */

/** 
 * The current page we are visiting.
 * @type {'home'|'projects'|'duck'}
 */
export const page = page_get_current();

/** 
 * Main document element.
 * @type {HTMLDivElement}
 */
export let main;

/**
 * List of viewable cards.
 * @type {Array<ViewableCard>}
 */
export let cards;

function init() {

	/** @type { HTMLElement } */
	const nav_entries = document.querySelector('#navbar-entries');
	main = /** @type {HTMLDivElement} */ (document.querySelector('main'));
	
	cards = Array.from(/** @type {NodeListOf<HTMLDivElement>} */ (main.querySelectorAll('.card')))
		.map((element) => {

			const content = (element.querySelector('.content'));

			if (!(content instanceof HTMLElement)) {
				return null;
			}

			const card = /** @type {ViewableCard} */ (element);
			card.tabIndex = 0;
			card.content = content;

			card.addEventListener('click', () => {
				dialog.view_card(card);
			});

			card.addEventListener('keypress', key_enter_wrapper(() => {
				dialog.view_card(card);
			}));

			return card;

		})
		.filter((card) => card !== null);

	if (page === 'home') {

		const hello = document.getElementById('js-hello');
		const hellooooo = (event) => {
			hello.textContent += '!';
		};

		hello.parentElement.addEventListener('click', hellooooo);
		hello.parentElement.addEventListener('keypress', key_enter_wrapper(hellooooo));

	}

	theme.init();
	dialog.init();

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
				nav_entries.scrollIntoView({ behavior: 'smooth' });
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

/**
 * Get the current page we are visiting.
 * @returns Current site page.
 */
function page_get_current() {

	switch (window.location.pathname.split('/').pop()) {
		case '': case 'index.html': return 'home';
		case 'projects.html': return 'projects';
		case 'duck.html': return 'duck';
	}

	throw `Unexpected unknown page ${window.location.pathname}, oops.`;

}

if (document.readyState === 'complete') {
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}

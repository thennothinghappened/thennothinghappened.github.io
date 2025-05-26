
/** @type {HTMLElement} */
let main;

/** @type {HTMLElement} */
let navEntries;

/** @type {ThemeManager} */
let themeManager;

document.addEventListener('DOMContentLoaded', () => {

	main = document.querySelector('main');
	navEntries = document.querySelector('#navbar-entries');
	
	const footer = document.querySelector('footer');
	themeManager = new ThemeManager();

	footer.appendChild(themeManager.selector);

	const cardPopupManager = new CardPopupManager();
	main.appendChild(cardPopupManager.dialog);

	window.addEventListener('beforeunload', animatePageHide);
	window.addEventListener('pageshow', animatePageShow);

	for (const anchor of document.querySelectorAll('a:not([href^="#"])')) {
		
		if (!(anchor instanceof HTMLAnchorElement)) {
			continue;
		}

		if (new URL(anchor.href).origin !== window.location.origin) {
			continue;
		}

		anchor.addEventListener('click', animateSameSiteHide);
		
	}

});

/**
 * Fade out the page content on leaving the page.
 */
function animatePageHide() {
	if (useCosmeticAnimations()) {
		main.classList.add('fadeout');
	}
}

/**
 * Fade the content back in on showing a page.
 */
function animatePageShow() {
	main.classList.remove('fadeout');
	animateSameSiteShow();
}

/**
 * Begin the animation for switching to another in-site content tab.
 */
function animateSameSiteHide() {
	if (useCosmeticAnimations()) {
		navEntries.scrollIntoView({ behavior: 'smooth' });
		window.localStorage.scrollBackIn = 'true';
	}
}

/**
 * Finish the tab-switch animation on the receiving side.
 */
function animateSameSiteShow() {
	if (window.localStorage.scrollBackIn === 'true') {
		delete window.localStorage.scrollBackIn;

		if (useCosmeticAnimations()) {
			main.scrollIntoView({ behavior: 'smooth' });
		}
	}
}

/**
 * Whether we should use cosmetic transition animations. The user may opt for reduced motion, which
 * disables these.
 */
function useCosmeticAnimations() {
	return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

class ThemeManager {

	/**
	 * @type {HTMLSelectElement}
	 */
	selector = document.createElement('select');

	/** 
	 * @private
	 * @type {HTMLLinkElement} 
	 */
	darkThemeLink = document.head.querySelector('link[href="/dark.css"]');

	/**
	 * @private
	 */
	darkThemeLinkMediaFollowSystem = this.darkThemeLink.media;

	constructor() {

		for (const theme of ['System', 'Light', 'Dark']) {

			const option = document.createElement('option');
			option.textContent = `${theme} Theme`;
			option.value = theme;

			this.selector.add(option);
			
		}

		this.setTheme(this.getTheme());
		this.selector.addEventListener('change', () =>
			this.setTheme(/** @type {Theme} */ (this.selector.value))
		);

	}

	/**
	 * @returns {Theme}
	 */
	getTheme() {
		return window.localStorage.theme ?? 'System';
	}

	/**
	 * @param {Theme} value 
	 */
	setTheme(value) {

		switch (value) {
			case 'Dark':
				this.darkThemeLink.disabled = false;
				this.darkThemeLink.media = '';
			break;

			case 'Light':
				this.darkThemeLink.disabled = true;
				this.darkThemeLink.media = '';
			break;

			case 'System':
				this.darkThemeLink.disabled = undefined;
				this.darkThemeLink.media = this.darkThemeLinkMediaFollowSystem;
			break;
		}

		window.localStorage.theme = value;
		this.selector.value = value;

	}

}

/**
 * Controller for a dialog on the page which displays card content.
 */
class CardPopupManager {

	dialog = document.createElement('dialog');

	/**
	 * @private
	 * @type {DialogState}
	 */
	state = 'closed';

	constructor() {

		this.dialog.addEventListener('click', (event) => {
			if (event.target === this.dialog) {
				this.close();
			}
		});
	
		this.dialog.addEventListener('animationend', () => {
	
			this.dialog.classList.remove('animate');
		
			if (this.state === 'opening') {
				this.state = 'open';
			} else {
				this.destroyDialog();
			}
		
		});

		for (const card of main.querySelectorAll('.card:has(> .content):has(> h1)')) {

			if (!(card instanceof HTMLElement)) {
				continue;
			}
			
			card.tabIndex = 0;

			card.addEventListener('click', () => this.open(card));
			card.addEventListener('keypress', (event) => {
				if (event.key === 'Enter') {
					this.open(card);
				}
			});

		}

	}

	/**
	 * View the given card's content as a pop-up.
	 * @param {HTMLElement} card 
	 */
	open(card) {

		if (this.state !== 'closed') {
			this.destroyDialog();
		}

		this.state = 'opening';

		const cardClone = card.cloneNode(false);

		const title = card.querySelector('h1').cloneNode(true);
		const content = card.querySelector('.content').cloneNode(true);
	
		cardClone.appendChild(title);
		cardClone.appendChild(content);
	
		this.dialog.appendChild(cardClone);
		this.dialog.showModal();

		if (useCosmeticAnimations()) {
			this.dialog.classList.add('animate');
		} else {
			this.state = 'open';
		}

	}
	
	/**
	 * Dismiss the current card.
	 */
	close() {
		if (useCosmeticAnimations()) {
			this.state = 'closing';
			this.dialog.classList.add('animate', 'hidden');
		} else {
			this.destroyDialog();
		}
	}

	/**
	 * @private
	 */
	destroyDialog() {
		
		this.dialog.close();
		this.dialog.classList.remove('animate', 'hidden');
		this.dialog.textContent = '';

		this.state = 'closed';

	}

}

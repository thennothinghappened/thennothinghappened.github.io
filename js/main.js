
/** @type {HTMLElement} */
let main;

/** @type {HTMLElement} */
let navEntries;

/** @type {ThemeManager} */
let themeManager;

/** @type {CardPopupManager} */
let cardPopupManager;

document.addEventListener('DOMContentLoaded', () => {

	main = document.querySelector('main');
	navEntries = document.querySelector('#navbar-entries');
	
	const footer = document.querySelector('footer');
	themeManager = new ThemeManager();

	cardPopupManager = new CardPopupManager(main);

	const settingsHeading = document.createElement('h3');
	settingsHeading.textContent = 'Display Settings';
	footer.appendChild(settingsHeading);

	const settingsBody = document.createElement('ul');
	settingsBody.id = 'display-settings';

	const themeSelectorLabel = document.createElement('li');
	themeSelectorLabel.textContent = 'Theme: ';
	themeSelectorLabel.appendChild(themeManager.selector);
	settingsBody.appendChild(themeSelectorLabel);

	const usePopupCardsLabel = document.createElement('li');
	usePopupCardsLabel.textContent = 'Display cards as pop-ups: ';
	const usePopUpCardsInput = document.createElement('input');
	usePopUpCardsInput.type = 'checkbox';
	usePopUpCardsInput.checked = usePopupCards();

	usePopUpCardsInput.addEventListener('change', () =>
		togglePopupCards(usePopUpCardsInput.checked, true)
	);

	usePopupCardsLabel.appendChild(usePopUpCardsInput);
	settingsBody.appendChild(usePopupCardsLabel);

	footer.appendChild(settingsBody);

	togglePopupCards(usePopupCards(), false);

	window.addEventListener('beforeunload', animatePageHide);
	window.addEventListener('pageshow', animatePageShow);

	for (const anchor of document.querySelectorAll('main a:not([href^="#"])')) {
		
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

/**
 * Whether to show cards as pop-ups, or just display articles as-is.
 */
function usePopupCards() {
	return window.localStorage.usePopupCards !== 'false';
}

/**
 * Toggle whether the pop-up cards are enabled.
 * TODO: refactor these preferences, this kinda sucks!
 * 
 * @param {boolean} enabled Whether the pop-ups are enabled.
 * @param {boolean} updatePreference Whether to update the value of the preference.
 */
function togglePopupCards(enabled, updatePreference) {
	if (enabled) {
		if (updatePreference) {
			window.localStorage.usePopupCards = 'true';
		}

		cardPopupManager.enable(main);
		document.body.classList.add('popup-cards');
	} else {
		if (updatePreference) {
			window.localStorage.usePopupCards = 'false';
		}

		cardPopupManager.disable();
		document.body.classList.remove('popup-cards');
	}
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
			option.textContent = theme;
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

	/**
	 * @private
	 */
	dialog = document.createElement('dialog');

	/**
	 * @private
	 * @type {HTMLElement[]}
	 */
	cards = [];

	/**
	 * @private
	 * @type {DialogState}
	 */
	dialogState = 'closed';

	/**
	 * 
	 * @param {HTMLElement} cardsContainer Container element where cards can be found.
	 */
	constructor(cardsContainer) {
		this.dialog.addEventListener('click', (event) => {
			if (event.target === this.dialog) {
				this.close();
			}
		});
	
		this.dialog.addEventListener('animationend', () => {
			
			this.dialog.classList.remove('animate');

			if (this.dialogState === 'closing') {
				this.dialog.close();
			}
			
		});

		this.dialog.addEventListener('close', () => {

			this.dialog.classList.remove('animate', 'hidden');
			this.dialog.textContent = '';

			this.dialogState = 'closed';

		});

		this.cards = Array.from(cardsContainer.querySelectorAll('.card:has(> .content)'));
	}

	/**
	 * Enable the pop-up functionality.
	 * @param {HTMLElement} dialogParent Parent element for the dialog.
	 */
	enable(dialogParent) {
		if (this.isEnabled()) {
			if (this.dialog.parentElement === dialogParent) {
				return;
			}

			this.disable();
		}

		this.cards.forEach(card => {
			card.tabIndex = 0;
			card.classList.add('animate');
			card.addEventListener('click', this.cardOnClick);
			card.addEventListener('keypress', this.cardOnKeypress);
		});

		dialogParent.appendChild(this.dialog);
	}

	/**
	 * Remove the pop-up functionality, restores regular card behaviour.
	 */
	disable() {
		if (!this.isEnabled()) {
			return;
		}

		this.cards.forEach(card => {
			card.tabIndex = undefined;
			card.classList.remove('animate');
			card.removeEventListener('click', this.cardOnClick);
			card.removeEventListener('keypress', this.cardOnKeypress);
		});

		this.dialog.remove();
	}

	/**
	 * Check whether pop-ups are enabled.
	 * @returns {boolean}
	 */
	isEnabled() {
		return this.dialog.parentElement != null;
	}

	/**
	 * View the given card's content as a pop-up.
	 * @param {HTMLElement} card 
	 */
	open(card) {

		if (this.dialogState !== 'closed') {
			this.close();
		}

		this.dialogState = 'open';

		const cardClone = card.cloneNode(true);
		this.dialog.appendChild(cardClone);
		this.dialog.showModal();

		if (useCosmeticAnimations()) {
			this.dialog.classList.add('animate');
		}

	}
	
	/**
	 * Dismiss the current card.
	 */
	close() {
		if (useCosmeticAnimations() && this.dialogState === 'open') {
			this.dialogState = 'closing';
			this.dialog.classList.add('animate', 'hidden');
		} else {
			this.dialog.close();
		}
	}

	/**
	 * @private
	 * @param {PointerEvent} event 
	 */
	cardOnClick = (event) => {
		if (event.currentTarget instanceof HTMLElement) {
			this.open(event.currentTarget);
		}
	}

	/**
	 * @private
	 * @param {KeyboardEvent} event 
	 */
	cardOnKeypress = (event) => {
		if (event.currentTarget instanceof HTMLElement) {
			if (event.key === 'Enter') {
				this.open(event.currentTarget);
			}
		}
	}
}

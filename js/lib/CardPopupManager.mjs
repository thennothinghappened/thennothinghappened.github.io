import { key_enter_wrapper } from './shared.mjs';

/**
 * @enum {string}
 * @readonly
 */
const DialogClass = {
	hidden: 'hidden',
	animate: 'animate'
};

/**
 * Controller for a dialog on the page which displays card content.
 */
export class CardPopupManager {

	/**
	 * @private
	 * @readonly
	 */
	dialog = document.createElement('dialog');

	constructor() {

		this.dialog.addEventListener('click', (event) => {
			if (event.target === this.dialog) {
				this.dismiss();
			}
		});
	
		this.dialog.addEventListener('animationend', () => {
	
			this.dialog.classList.remove(DialogClass.animate);
		
			if (this.dialog.classList.contains(DialogClass.hidden)) {
				this.dialog.classList.remove(DialogClass.hidden);
				this.dialog.close();
			}
		
		});

	}

	/**
	 * View the given card's content as a pop-up.
	 * @param {HTMLElement} card 
	 */
	show(card) {

		const cardClone = card.cloneNode(false);

		const title = card.querySelector('h1').cloneNode(true);
		const content = card.querySelector('.content').cloneNode(true);
	
		cardClone.appendChild(title);
		cardClone.appendChild(content);
	
		this.dialog.textContent = '';
		this.dialog.appendChild(cardClone);
	
		this.dialog.showModal();
		this.dialog.classList.add(DialogClass.animate);

	}
	
	/**
	 * Dismiss the current card.
	 */
	dismiss() {
		this.dialog.classList.add(DialogClass.animate, DialogClass.hidden);
	}

	/**
	 * Set up events for clicking viewable cards.
	 * @param {HTMLElement} main 
	 */
	init(main) {

		for (const card of main.querySelectorAll('.card:has(> .content):has(> h1)')) {

			if (!(card instanceof HTMLElement)) {
				continue;
			}
			
			card.tabIndex = 0;
			card.addEventListener('click', () => this.show(card));
			card.addEventListener('keypress', key_enter_wrapper(() => this.show(card)));

		}
		
		main.appendChild(this.dialog);

	}

}

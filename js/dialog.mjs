import { main } from '/js/main.mjs';

/**
 * @enum {string}
 */
const DialogClass = {
    hidden: 'hidden',
    animate: 'animate'
};

/** @type {HTMLDialogElement} */
let dialog;

export function init() {

    dialog = document.createElement('dialog');

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dismiss();
        }
    });

    dialog.addEventListener('animationend', () => {

        dialog.classList.remove(DialogClass.animate);
    
        if (dialog.classList.contains('hidden')) {
            dialog.classList.remove(DialogClass.hidden);
            dialog.close();
        }
    
    });

    main.appendChild(dialog);

}

/**
 * View a card in a popup
 * @param {import('/js/main.mjs').ViewableCard} card 
 */
export function view_card(card) {

    const card_clone = card.cloneNode(false);

    const title = card.querySelector('h1').cloneNode(true);
    const content = card.content.cloneNode(true);

    card_clone.appendChild(title);
    card_clone.appendChild(content);

    dialog.innerHTML = '';
    dialog.appendChild(card_clone);

    reveal();

}

function reveal() {
    dialog.showModal();
    dialog.classList.add('animate');
}

function dismiss() {
    dialog.classList.add('animate', 'hidden');
}


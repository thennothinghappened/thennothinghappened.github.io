
function init() {

// Initial setup
const main = document.querySelector('main');

/** @type { HTMLElement[] } */
// @ts-ignore
const pages = Array.from(main.children);

const dialog = document.createElement('dialog');
// Close dialog on click off
dialog.addEventListener('click', (event) => {
    if ( event.target === dialog ) {
        dialog.close();
    }
})

main.appendChild(dialog);

/** @type { HTMLElement } */
const nav_entries = document.querySelector('#navbar-entries');

// Get the initial visible page
let current_page = pages.find(
    page => !page.classList.contains('hidden')
);

// Set up hash handling
window.addEventListener('hashchange', on_hashchange);
on_hashchange(false);

// Set up dark theme/switch
(function() {

function toggle_darkmode() {
    set_darkmode(!is_dark());
}

function is_dark() {
    return localStorage.getItem('dark') === 'true';
}

/**
 * @param {boolean} enabled 
 */
function set_darkmode(enabled) {
    localStorage.setItem('dark', enabled.toString());

    if (enabled) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

set_darkmode(is_dark());

document.querySelector('#js-darkmode').addEventListener('click', toggle_darkmode);

})();

// Set up navigation links
(function() {

    for ( const link of document.querySelectorAll('a[href^="#"]') ) {
        link.addEventListener('click', (event) => {

            event.preventDefault();
            goto_hash(link.href);

        });
    }

})();

// Set up card click handlers
(function() {

    /** @type { HTMLElement[] } */
    const cards = Array.from(main.querySelectorAll('.card'));
    const clickable_cards = cards.filter(card => card.querySelector('.content') !== null);

    for (const card of clickable_cards) {

        function view_this_card() { view_card(card); }

        card.tabIndex = 0;
        card.addEventListener('click', view_this_card);
        card.addEventListener('keypress', handle_enter(view_this_card));
    }

})();

// Set up home page
(function() {

    /** @type { HTMLElement } */
    const home = main.querySelector('#home');

    // Hello!!!!!!
    (function() {

        /** @type { HTMLElement } */
        const hello = home.querySelector('#js-hello');

        function handle_hello() {
            hello.textContent += '!';
        }

        hello.parentElement.addEventListener('click', handle_hello);
        hello.parentElement.addEventListener('keypress', handle_enter(handle_hello));

    })();

    // Goto projects card
    (function() {
        
        /** @type { HTMLElement } */
        const goto_projects = home.querySelector('#js-goto-projects');

        function handle_goto_projects() {
            goto_hash('#projects');
        }

        goto_projects.tabIndex = 0;

        goto_projects.addEventListener('click', handle_goto_projects);
        goto_projects.addEventListener('keypress', handle_enter(handle_goto_projects));

    })();

})();

/**
 * Handler for hashchange to change page
 */
function on_hashchange(smooth = true) {

    const newloc = window.location.hash.slice(1);
    const new_page = pages.find( page => page.id === newloc );

    if ( new_page === undefined ) {
        return;
    }

    if (smooth) {
        new_page.scrollIntoView({
            behavior: 'smooth'
        });
    }

    visit_page(new_page);
}

/**
 * Wrapper to go to a given hash
 * @param {string} hash 
 */
function goto_hash(hash) {
    window.history.pushState({}, '', hash);
    on_hashchange();
}

/**
 * Visit a new page given the associated element
 * @param {HTMLElement} new_page 
 */
function visit_page(new_page) {

    current_page.classList.add('hidden');
    new_page.classList.remove('hidden');

    nav_entries.querySelector('.selected').classList.remove('selected');
    nav_entries.querySelector(`[href='#${ new_page.id }']`).classList.add('selected');

    current_page = new_page;
}

/**
 * View a card in a popup
 * @param {HTMLElement} card 
 */
function view_card(card) {

    const card_clone = card.cloneNode(false);

    const title = card.querySelector('h1').cloneNode(true);
    const content = card.querySelector('.content').cloneNode(true);

    card_clone.appendChild(title);
    card_clone.appendChild(content);

    dialog.innerHTML = '';
    dialog.appendChild(card_clone);

    dialog.showModal();
}

/**
 * Wrapper to handle enter key press on an element
 * @param { (event: KeyboardEvent) => void } callback 
 */
function handle_enter(callback) {
    /**
     * @param { KeyboardEvent } event
     */
    return function (event) {
        if (event.key === 'Enter') {
            callback(event);
        }
    }
}

}

if ( document.readyState === 'complete' ) {
    init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    })
}
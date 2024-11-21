
export function init() {
	document.querySelector('#js-darkmode').addEventListener('click', darkmode_toggle);
	darkmode_set(darkmode_get());
}

export function darkmode_toggle() {
	darkmode_set(!darkmode_get());
}

/**
 * @returns {boolean}
 */
function darkmode_get() {
	return localStorage.getItem('dark') === 'true';
}

/**
 * @param {boolean} dark 
 */
function darkmode_set(dark) {
	
	localStorage.setItem('dark', dark.toString());

	if (dark) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}

}

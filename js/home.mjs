import { initSharedContent } from '/js/lib/shared.mjs';

function init() {
	initSharedContent();
	initHelloCard();
}

function initHelloCard() {
	const helloCard = document.getElementById('js-hello');
	helloCard.parentElement.addEventListener('click', () => helloCard.textContent += '!');
}

if (document.readyState === 'complete') {
	
} else {
	document.addEventListener('DOMContentLoaded', init);
}

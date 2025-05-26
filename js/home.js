
document.addEventListener('DOMContentLoaded', () => {
	const helloCard = document.getElementById('js-hello');
	helloCard.parentElement.addEventListener('click', () => helloCard.textContent += '!');
});

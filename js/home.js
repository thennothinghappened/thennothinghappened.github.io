
document.addEventListener('DOMContentLoaded', () => {
	const helloCard = document.getElementById('js-hello');
	helloCard.classList.add('animate');
	helloCard.parentElement.addEventListener('click', () => helloCard.textContent += '!');
});

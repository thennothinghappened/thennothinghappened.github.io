import { initSharedContent } from '/js/lib/shared.mjs';

if (document.readyState === 'complete') {
	initSharedContent();
} else {
	document.addEventListener('DOMContentLoaded', initSharedContent);
}


export declare global {

	type Theme =
		'System'	|
		'Light'		|
		'Dark'		;

	interface Window {
		localStorage: Storage & {
			theme: Theme | undefined;
			scrollBackIn: 'true' | undefined;
		};
	};

	type DialogState =
		'closed'	|
		'open'		|
		'closing'	;

};


export function getQueryParameterByName(name, url = window.location.href) {
	const parsed = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp('[?&]' + parsed + '(=([^&#]*)|&|#|$)');
	const results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getHashParameterByName(name, url = window.location.hash) {
	const parsed = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp('[#&]' + parsed + '(=([^&]*)|&|$)');
	const results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function reportApiError(title:string, payload:{ success:boolean, message:string }) {
	if (!payload.success) {
		console.error(title + ':' + payload.message, payload);
		return true;
	}
	
	return false;
}

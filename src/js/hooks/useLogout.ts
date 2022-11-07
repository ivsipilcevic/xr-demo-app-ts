
import { instance } from '../redux/async/PlayFabXR';

export function useLogout() {
	function Logout() {
		instance.Auth.Logout().then(() => window.location.reload());
	}

	return {
		Logout,
	};
}
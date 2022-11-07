import { useState } from 'react';
import { useAppDispatch } from '../redux/config/store';
import { authPlayfab } from '../redux/playfab';
import { guid } from '../utils/guid';

export default function useLogin() {
	const appDispatch = useAppDispatch();
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	function OnClickNewUser() {
		setIsLoggingIn(true);
		appDispatch(authPlayfab({ userId: 'SomeUserId' })).then(() => {
			setIsLoggingIn(false);
		});
	}

	return {
		IsLoggingIn: isLoggingIn,
		OnClickNewUser,
	};
}
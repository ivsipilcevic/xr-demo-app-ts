import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../redux/config/store';
import { writePlayerEvent } from '../redux/playfab';
import useGlobalVariables from './useGlobalVariables';
import usePlayFab from './usePlayFab';

export default function useRouteEvents() {
	const location = useLocation();
	const { playerId } = usePlayFab();
	const dispatch = useAppDispatch();
	const { RoutesNiceNames } = useGlobalVariables();

	useEffect(() => {
		if (Object.keys(RoutesNiceNames).length > 0 && playerId) {
			dispatch(writePlayerEvent({
				name: 'screen_view',
				body: { location: RoutesNiceNames[window.location.pathname] || 'unknown route' },
			}));
		}
	}, [playerId, location, RoutesNiceNames]);
}
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/config/store';
import { writePlayerEvent } from '../redux/playfab';
import useGlobalVariables from './useGlobalVariables';
import usePlayFab from './usePlayFab';

export default function useHeartbeat() {
	const { playerId } = usePlayFab();
	const dispatch = useAppDispatch();

	const { RoutesNiceNames } = useGlobalVariables();

	useEffect(() => {
		let interval;

		if (playerId) {
			interval = setInterval(() => {
				dispatch(writePlayerEvent({
					name: 'heartbeat',
					body: { screen_name: RoutesNiceNames[window.location.pathname] || 'unknown route' },
				}));
			}, 10000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [playerId, RoutesNiceNames]);
}
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, IRootState } from '../redux/config/store';
import { getOtherPlayerProfile } from '../redux/other_players';

export function useOtherPlayerProfile(playFabId:string, forceRefresh = false) {
	const dispatch = useAppDispatch();

	const otherPlayerProfile = useSelector((state:IRootState) => state.other_players.profiles[playFabId]);

	useEffect(() => {
		if (!otherPlayerProfile && playFabId) {
			dispatch(getOtherPlayerProfile(playFabId));
		}
	}, [otherPlayerProfile, playFabId]);

	useEffect(() => {
		if (forceRefresh) {
			dispatch(getOtherPlayerProfile(playFabId));
		}
	}, []);
	
	return otherPlayerProfile;
}

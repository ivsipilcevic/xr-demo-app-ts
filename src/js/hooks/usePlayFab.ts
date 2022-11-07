import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCatalog } from '../redux/catalog';

import { IRootState, useAppDispatch } from '../redux/config/store';
import { getItemInventory } from '../redux/inventory';
import { getPlayerCombinedInfo } from '../redux/playfab';
import { getPlayerStatistics } from '../redux/statistics';
import { getTitleData } from '../redux/title_data';

export default function usePlayFab() {
	const {
		PlayFabId,
		DisplayName,
		AvatarUrl,
		pollRates,
		currencies,
	} = useSelector((state:IRootState) => state.playfab);
	
	const alreadyLoaded = Boolean(DisplayName);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!alreadyLoaded && PlayFabId) {
			dispatch(getItemInventory());
			dispatch(getCatalog());
			dispatch(getPlayerCombinedInfo());
			dispatch(getTitleData());
		}
	}, [PlayFabId, alreadyLoaded]);

	return {
		playerId: PlayFabId,
		pollRates,
		currencies,
		DisplayName,
		AvatarUrl,
	};
}
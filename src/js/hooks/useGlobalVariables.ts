import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ITEM_CLASSES } from '../Constants';
import { IRootState, useAppDispatch } from '../redux/config/store';
import { getGlobalVariables } from '../redux/global_variables';
import usePlayFab from './usePlayFab';

export default function useGlobalVariables() {
	const dispatch = useAppDispatch();
	const { playerId } = usePlayFab();
	const globalVariables = useSelector((state:IRootState) => state.global_variables);

	useEffect(() => {
		if (!globalVariables.isLoaded && playerId) {
			dispatch(getGlobalVariables());
		}
	}, [globalVariables.isLoaded, playerId]);

	const overrides = useSelector((state:IRootState) => state.inventory.filter(i => i.playfab.ItemClass === ITEM_CLASSES.OVERRIDE)) as OverrideItem[];

	overrides.sort((a, b) => {
		return new Date(b.playfab.Expiration).getTime() - new Date(a.playfab.Expiration).getTime();
	});

	if (overrides && globalVariables.isLoaded) {
		const copy = {
			...globalVariables,
		};

		overrides.forEach(override => {
			if (copy[override.data.GlobalVariableName]) {
				copy[override.data.GlobalVariableName] = {
					...copy[override.data.GlobalVariableName],
					...override.data.Value,
				};
			} else {
				copy[override.data.GlobalVariableName] = override.data.Value;
			}
		});

		return copy;
	}

	return globalVariables;
}
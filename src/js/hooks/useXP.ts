import { useSelector } from 'react-redux';
import { IRootState } from '../redux/config/store';
import { currentLevelThresholdSelector, levelThresholdSelector, statsSelector } from '../selectors/statistics';


export default function useXP() {
	const nextLevelXp = useSelector(levelThresholdSelector);
	const currentLevelXp = useSelector(currentLevelThresholdSelector);

	const {
		xp = 0,
	} = useSelector(statsSelector);

	const levels = useSelector((state:IRootState) => state.title_data.xp_levels) || [];

	const level = levels.reduce((carry, maxXp, index) => {
		if (xp >= maxXp) return index + 2;
		return carry;
	}, 1);

	return {
		xp,
		nextLevelXp,
		currentLevelXp,
		level,
	};
}
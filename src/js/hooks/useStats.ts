/* eslint-disable @typescript-eslint/naming-convention */
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/config/store';
import { statsSelector } from '../selectors/statistics';

export default function useStats() {
	const {
		matches_watched,
		minutes_watched,
		achievements_unlocked,
		viewer_type,
	} = useSelector(statsSelector);

	const viewer_types = useSelector((state:IRootState) => state.title_data.viewer_types);

	return {
		matches_watched,
		minutes_watched,
		achievements_unlocked,
		viewer_type: viewer_types[viewer_type || 0] || '',
	};
}
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState, useAppDispatch } from '../redux/config/store';
import { getMissionInventory } from '../redux/missions';


export default function useMissions(filter:string = null) {
	const missions = useSelector((state:IRootState) => state.missions.list);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (missions.length === 0) {
			dispatch(getMissionInventory());
		}
	}, [missions]);

	if (!filter) return missions;
	return missions.filter(mission => mission.type.title === filter);
}
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/config/store';

export default function usePlayerData() {
	const playerData = useSelector((state:IRootState) => state.playerData.data);
	const isPlayerDataLoaded = useSelector((state:IRootState) => state.playerData.loaded);

	return {
		playerData,
		isPlayerDataLoaded,
	};
}
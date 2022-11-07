import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/config/store';
import first from '../utils/first';

export default function useNotifications() {
	const notifications = useSelector((state:IRootState) => state.notifications.list);

	const notification = useMemo(() => {
		const arr = [...notifications];
		arr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

		return first(arr);
	}, [notifications]);

	return notification as IXRRealtimeNotification | null;
}
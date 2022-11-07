/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice } from '@reduxjs/toolkit';
import { PLAYFAB_APP_ID } from '../Constants';
import { realtimeApi } from './async/api';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';

type INotificationsState = typeof initialState;

const initialState = {
	list: [] as IXRRealtimeNotification[],
	filteredOut: localStorage.getItem('filteredOutNotifications') ? JSON.parse(localStorage.getItem('filteredOutNotifications') || '[]') : [],
};

export const getRealtimeNotifications = createDebouncedAsyncAction(
	'realtime/getRealtimeNotifications',
	(playerId:string) => {
		return realtimeApi('client/GetNotifications', {
			AppId: PLAYFAB_APP_ID,
			PlayFabId: playerId,
		});
	},
	{
		fulfilled: (state:INotificationsState, action) => {
			return {
				...state,
				list: action.payload.map(n => ({
					...n,
				})).filter(n => !state.filteredOut.includes(n.id)),
			};
		},
	},
);

const notifications = createSlice({
	name: 'notifications',
	reducers: {
		addNotification: (state:INotificationsState, action: { payload: IXRRealtimeNotification }) => {
			state.list.push({
				...action.payload,
				message: action.payload?.text || action.payload?.message,
				timestamp: new Date().toISOString(),
			});
		},
		removeNotification: (state:INotificationsState, action) => {
			localStorage.setItem('filteredOutNotifications', JSON.stringify([...state.filteredOut, action.payload]));
			return {
				...state,
				filteredOut: [...state.filteredOut, action.payload],
				list: state.list.filter(notification => notification.id !== action.payload),
			};
		},
	},
	extraReducers: {
		...getRealtimeNotifications.reducers,
	},
	initialState,
});

export default notifications;

export const { addNotification, removeNotification } = notifications.actions;
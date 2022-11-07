import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from '../redux/async/PlayFabXR';
import { realtimeApi } from './async/api';
import { PLAYFAB_APP_ID } from '../Constants';

const defaultRealtimeData = {
	versions: {
		news: null,
	},
	notifications: [] as IXRRealtimeNotification[],
	lastUpdates: {} as Record<string, string>,
	playerStatus: [] as string[],
};

type IRealtimeState = typeof defaultRealtimeData;

export const getLiveVersion = createDebouncedAsyncAction<IRealtimeState>(
	'realtime/getLiveVersion',
	() => {
		return realtimeApi('client/GetLiveVersion');
	},
	{
		fulfilled: (state, action) => {
			if (state.versions.news !== action.payload.news) {
				state.versions.news = action.payload.news;
			}
		},
	},
);

export const getRealtimeEvents = createDebouncedAsyncAction<IRealtimeState>(
	'realtime/getRealtimeEvents',
	() => {
		return realtimeApi('client/GetRealtimeEvents', {
			PlayFabId: playfabXR.GetPlayFabId(),
		});
	},
	{
		fulfilled: (state, action) => {
			const payload = action.payload[`playstream/${PLAYFAB_APP_ID}/${playfabXR.GetPlayFabId()}`] || {};

			if (state.playerStatus.length === 0 && Object.keys(payload).length === 0) return state;
			const playerStatus = Object.entries(payload).reduce((acc, [status, lastUpdate]) => {
				if (lastUpdate !== state.lastUpdates[status]) {
					acc.push(status);
				}
				return acc;
			}, [] as string[]);

			return {
				...state,
				lastUpdates: { ...payload },
				playerStatus,
			};
		},
	},
);

const realtime = createSlice({
	name: 'realtime',
	reducers: {
		setPlayerStatus: (state:IRealtimeState, action) => {
			const payload:string[] = action.payload;

			return {
				...state,
				playerStatus: [ ...state.playerStatus, ...payload],
			};
		},
	},
	extraReducers: {
		...getLiveVersion.reducers,
		...getRealtimeEvents.reducers,
	},
	initialState: defaultRealtimeData,
});

export default realtime;

export const { setPlayerStatus } = realtime.actions;
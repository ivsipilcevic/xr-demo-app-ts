import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from '../redux/async/PlayFabXR';
import { getPlayerCombinedInfo } from './playfab';
import xrAction from './async/xrAction';

export type IPlayerStatistics = {
	xp: number,
	level: number,
	favorite_team: number,
	minutes_watched: number,
	matches_watched: number,
	achievements_unlocked: number,
	viewer_type: number,
};

export const getPlayerStatistics = createDebouncedAsyncAction(
	'playfab-xr/GetPlayerStatistics',
	xrAction(playfabXR.Client.GetPlayerStatistics),
	{
		fulfilled: (state:IPlayerStatistics, action) => {
			const newStats = action.payload.data?.Statistics?.reduce((c, stat) => {
				c[stat.StatisticName] = stat.Value;
				return c;
			}, {});

			return {
				...state,
				...newStats,
			};
		},
	},
);

const defaultPlayerStatistics:IPlayerStatistics = {
	xp: 0,
	level: 0,
	favorite_team: 0,
	minutes_watched: 0,
	matches_watched: 0,
	achievements_unlocked: 0,
	viewer_type: 0,
};

const statistics = createSlice({
	name: 'statistics',
	reducers: {
		updateLocalStatistic: (state, action) => {
			const { name, value } = action.payload;
			state[name] = value;
		},
	},
	extraReducers: {
		...getPlayerStatistics.reducers,
		[getPlayerCombinedInfo.actionName + '/fulfilled']: (state:IPlayerStatistics, action) => {
			const newStats = action.payload.data?.InfoResultPayload?.PlayerStatistics?.reduce((c, stat) => {
				c[stat.StatisticName] = stat.Value;
				return c;
			}, {});

			return {
				...state,
				...newStats,
			};
		},
	},
	initialState: defaultPlayerStatistics,
});

export default statistics;

export const { updateLocalStatistic } = statistics.actions;
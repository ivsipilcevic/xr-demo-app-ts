import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from './async/PlayFabXR';
import xrAction from './async/xrAction';

const defaultMissionState = {
	list: [] as IXRMissionItem[],
};
type IMissionState = typeof defaultMissionState;

export const getMissionInventory = createDebouncedAsyncAction(
	'playfab-xr/getMissionInventory',
	xrAction(playfabXR.Client.GetMissionInventory),
	{
		fulfilled: (state:IMissionState, action) => {
			return {
				...state,
				list: [...action.payload.data.missions.PlayerMissions.map(mission => {
					mission.data = mission.data.reduce((c, { dataKey, dataVal }) => {
						c[dataKey] = dataVal;
						return c;
					}, {});
					return mission;
				})],
			};
		},
	},
);

export const resetMission = createDebouncedAsyncAction(
	'playfab-xr/resetMission',
	xrAction((param) => {
		return playfabXR.Client.ResetMission({
			ItemId: param.item_id,
		});
	}),
	{},
);

const missions = createSlice({
	name: 'missions',
	reducers: {},
	extraReducers: {
		...getMissionInventory.reducers,
		...resetMission.reducers,
	},
	initialState: defaultMissionState,
});

export default missions;

export const {} = missions.actions;
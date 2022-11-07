import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import xrAction from './async/xrAction';
import { instance as playfabXR } from './async/PlayFabXR';

type IOtherPlayersState = {
	profiles: {
		[key:string]: GetPlayerProfileResponse['Profile'],
	},
};
const initialState = {
	profiles: {},
	inventories: {},
} as IOtherPlayersState;

export const getOtherPlayerProfile = createDebouncedAsyncAction(
	'playfab/getOtherPlayerProfile',
	xrAction((playFabId) => {
		return playfabXR.Client.GetPlayerProfile({
			PlayFabId: playFabId,
		});
	}),
	{
		fulfilled: (state:IOtherPlayersState, action) => {
			const profile = action.payload.data.Profile;
			return {
				...state,
				profiles: {
					...state.profiles,
					[profile.PlayerId]: {
						...profile,
					},
				},
			};
		},
	},
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const other_players = createSlice({
	name: 'other_players',
	reducers: {
	},
	extraReducers: {
		...getOtherPlayerProfile.reducers,
	},
	initialState,
});

export default other_players;

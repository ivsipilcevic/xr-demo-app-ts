/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from './async/PlayFabXR';
import xrAction from './async/xrAction';

type IXrStoreState = typeof initialState;

const initialState = {
	loadout: [] as IXRStore[],
};

export const getStoreLoadout = createDebouncedAsyncAction(
	'playfab-xr/getStoreLoadout',
	xrAction(() => {
		return playfabXR.Client.GetStoreLoadout();
	}),
	{
		fulfilled: (state:IXrStoreState, action) => {
			state.loadout = [...action.payload.data.StoreLoadout];
		},
	},
);

const xr_store = createSlice({
	name: 'xr_store',
	reducers: {
	},
	extraReducers: {
		...getStoreLoadout.reducers,
	},
	initialState,
});

export default xr_store;

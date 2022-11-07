import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from './async/PlayFabXR';
import xrAction from './async/xrAction';

type IGlobalVariablesState = typeof initialState;

export const getGlobalVariables = createDebouncedAsyncAction(
	'playfab-xr/getGlobalVariables',
	xrAction(() => {
		return playfabXR.Client.GetGlobalVariable();
	}),
	{
		fulfilled: (state:IGlobalVariablesState, action) => {
			return {
				...state,
				isLoaded: true,
				...action.payload.data.GlobalVariables.reduce((acc, curr) => {
					acc[curr.dataKey] = curr.dataVal;
					return acc;
				}, {}),
			};
		},
	},
);

const initialState = {
	RoutesNiceNames: {} as Record<string, string>,
	AppSettings: {} as (AppSettings | null),
	isLoaded: false,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const global_variables = createSlice({
	name: 'global_variables',
	reducers: {},
	extraReducers: {
		...getGlobalVariables.reducers,
	},
	initialState,
});

export default global_variables;

export const {} = global_variables.actions;

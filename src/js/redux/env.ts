import { createSlice, createAction } from '@reduxjs/toolkit';
import { DEFAULT_LANG, ROUTES } from '../Constants';
import { getQueryParameterByName } from '../utils/urlUtils';

export type IEnvState = typeof initialState;

export const incrementErrors = createAction('env/error');

const initialState = {
	Lang: getQueryParameterByName('lang') || DEFAULT_LANG,
	LastPath: ROUTES.ROOT,
	Errors: [],
};

const env = createSlice({
	name: 'env',
	reducers: {
		setLastPath: (state, action) => { state.LastPath = action.payload; },
	},
	extraReducers: {
		[incrementErrors.name]: (state) => {
			return {
				...state,
				Errors: [
					...state.Errors,
					Date.now(),
				],
			};
		},
	},
	initialState,
});

export default env;

export const { setLastPath } = env.actions;

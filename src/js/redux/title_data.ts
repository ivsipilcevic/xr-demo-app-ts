import { createSlice } from '@reduxjs/toolkit';
import { playfabClientApi } from './async/api';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';

const defaultTitleData = {
	xp_levels: [] as number[],
	viewer_types: [] as string[],
};

type ITitleDataState = typeof defaultTitleData;

export const getTitleData = createDebouncedAsyncAction(
	'playfab/getTitleData',
	() => {
		return playfabClientApi('GetTitleData', {});
	},
	{
		fulfilled: (state:ITitleDataState, action) => {
			const data:{ [key:string]: string } = action.payload.data.Data;

			Object.entries(data).forEach(([key, value]) => {
				const json = JSON.parse(value);
				if (json) {
					data[key] = json;
				}
			});

			return {
				...state,
				...data,
			};
		},
	},
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const title_data = createSlice({
	name: 'title_data',
	reducers: {},
	extraReducers: {
		...getTitleData.reducers,
	},
	initialState: defaultTitleData,
});

export default title_data;

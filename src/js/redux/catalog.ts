import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from './async/PlayFabXR';
import xrAction from './async/xrAction';

type ICatalogState = typeof initialState;
const initialState = {
	items: [] as IXRInventoryItemParsedData[],
};

export const getCatalog = createDebouncedAsyncAction<ICatalogState>(
	'playfab-xr/getItemCatalog',
	xrAction(playfabXR.Client.GetItemCatalog),
	{
		fulfilled: (state, action) => {
			return {
				...state,
				items: (action.payload?.data?.Catalog || []).map((item) => ({
					...item,
					data: item.data.reduce((c, data) => {
						c[data.dataKey] = data.dataVal;
						return c;
					}, {}),
				})),
			};
		},
	},
);

const catalog = createSlice({
	name: 'catalog',
	reducers: {},
	extraReducers: {
		...getCatalog.reducers,
	},
	initialState,
});

export default catalog;
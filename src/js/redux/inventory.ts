import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import xrAction from './async/xrAction';
import { instance as playfabXR } from '../redux/async/PlayFabXR';

type IInventoryState = typeof initialState;

export const getItemInventory = createDebouncedAsyncAction(
	'inventory/getItemInventory',
	xrAction(playfabXR.Client.GetItemInventory),
	{
		pending: () => {
		},
		fulfilled: (state:IInventoryState, action) => {
			return [...action.payload.data?.items].map(item => ({
				...item,
				data: (item.data || []).reduce((c, data) => {
					c[data.dataKey] = data.dataVal;
					return c;
				}, {} as Record<string, string>),
			}));
		},
	},
);

const initialState:IXRInventoryItemParsedData[] = [];

const inventory = createSlice({
	name: 'inventory',
	reducers: {
		deleteItem: (state, action:{ payload: string }) => {
			return state.filter(item => item.playfab.ItemInstanceId !== action.payload);
		},
		changeItemRemainingUses: (state, action) => {
			const { itemId, amount } = action.payload;

			const item = state.find(i => i.itemId === itemId);

			if (item) {
				item.playfab.RemainingUses += amount;
			}
		},
	},
	extraReducers: {
		...getItemInventory.reducers,
	},
	initialState,
});

export default inventory;

export const { changeItemRemainingUses, deleteItem } = inventory.actions;
import { createSlice } from '@reduxjs/toolkit';

import { POLL_RATES } from '../Constants';

import { playfabClientApi, playfabCloudScriptApi } from '../redux/async/api';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import xrAction from './async/xrAction';
import { instance as playfabXR } from '../redux/async/PlayFabXR';

type IPlayfabState = typeof initialState;

export const authPlayfab = createDebouncedAsyncAction(
	'playfab-xr/auth',
	xrAction(({ userId }) => {
		return playfabXR.Auth.LoginWithCustomID({
			CustomId: userId,
		});
	}),
	{
		fulfilled: (state:IPlayfabState, action) => {
			return {
				...state,
				...action.payload.data.LoginResult,
			};
		},
	},
);

const promiseCreator = xrAction(() => {
	return playfabXR.Service.GetLiveBroadcast({ TimeRange: 5 });
});

export const getLiveBroadcasts = createDebouncedAsyncAction(
	'playfab-xr/getLiveBroadcasts',
	promiseCreator,
	{
		fulfilled: (state:IPlayfabState, action) => {
			const broadcasts = action.payload.data?.Broadcasts || [];

			return {
				...state,
				LiveBroadcasts: broadcasts,
			};
		},
	},
);

export const writePlayerEvent = createDebouncedAsyncAction(
	'playfab-xr/writePlayerEvent',
	xrAction(({ name, body }:{ name:string, body:any }) => {
		return playfabXR.Client.WritePlayerEvent({
			EventName: name,
			Body: JSON.stringify(body),
		});
	}),
);

export const sendHeartbeat = createDebouncedAsyncAction(
	'playfab/sendHeartbeat',
	(data = {}) => {
		return playfabCloudScriptApi('ExecuteFunction', {
			FunctionName: 'Heartbeat',
			FunctionParameter: data,
			GeneratePlayStreamEvent: true,
		});
	},
);

export const getVirtualCurrency = createDebouncedAsyncAction(
	'playfab-xr/getVirtualCurrency',
	xrAction(() => {
		return playfabXR.Client.GetVirtualCurrency();
	}),
	{
		fulfilled: (state:IPlayfabState, action) => {
			return {
				...state,
				currencies: Object.entries(action.payload.data.VirtualCurrencies).reduce((c, [currency, amount]) => {
					c[currency] = amount;
					return c;
				}, {}),
			};
		},
	},
);

export const consumeInventoryItem = createDebouncedAsyncAction(
	'playfab-xr/consumeInventoryItem',
	xrAction((data:{ ItemInstanceId:string, ConsumeCount:number }) => {
		return playfabXR.Client.ConsumeItem(data);
	}),
);

export const getStoreLoadout = createDebouncedAsyncAction(
	'playfab-xr/getStoreLoadout',
	xrAction(() => {
		return playfabXR.Client.GetStoreLoadout();
	}),
	{
		fulfilled: (state:IPlayfabState, action) => {
			return {
				...state,
				StoreLoadout: [...action.payload.data?.StoreLoadout],
			};
		},
	},
);

export const sendMissionInput = createDebouncedAsyncAction(
	'playfab-xr/sendMissionInput',
	xrAction((data) => {
		return playfabXR.Client.SendMissionInput({
			ItemId: data.mission_id,
			ObjectiveId: data.objective_id,
			Input: data.answer,
		});
	}),
);

export const getInstanceLeaderboard = createDebouncedAsyncAction(
	'playfab-xr/getInstanceLeaderboard',
	xrAction((data) => {
		return playfabXR.Client.GetInstanceLeaderboard({
			CustomInstanceId: data.instanceId,
			StatName: data.statName,
		});
	}),
);

export const getPlayerCombinedInfo = createDebouncedAsyncAction(
	'playfab/getPlayerCombinedInfo',
	() => {
		return playfabClientApi('GetPlayerCombinedInfo', {
			InfoRequestParameters: {
				GetPlayerProfile: true,
				GetPlayerStatistics: true,
				GetUserVirtualCurrency: true,
				GetUserReadOnlyData: true,
				GetUserData: true,
				ProfileConstraints: {
					ShowDisplayName: true,
					ShowCreated: false,
					ShowOrigination: false,
					ShowLastLogin: true,
					ShowBannedUntil: false,
					ShowStatistics: true,
					ShowCampaignAttributions: false,
					ShowPushNotificationRegistrations: false,
					ShowLinkedAccounts: false,
					ShowContactEmailAddresses: false,
					ShowTotalValueToDateInUsd: false,
					ShowValuesToDate: false,
					ShowVirtualCurrencyBalances: false,
					ShowTags: false,
					ShowLocations: false,
					ShowAvatarUrl: true,
					ShowMemberships: false,
					ShowExperimentVariants: false,
				},
			},
		});
	},
	{
		fulfilled: (state:IPlayfabState, action) => {
			return {
				...state,
				DisplayName: action.payload.data.InfoResultPayload.PlayerProfile?.DisplayName,
				AvatarUrl: action.payload.data.InfoResultPayload.PlayerProfile?.AvatarUrl,
				currencies: {
					...action.payload.data.InfoResultPayload.UserVirtualCurrency,
				},
			};
		},
	},
);


const initialState = {
	PlayFabId: playfabXR.GetPlayFabId(),
	DisplayName: '',
	AvatarUrl: '',
	currencies: {
		CO: 0,
	} as { [key:string]:number },
	LiveBroadcasts: [] as IBroadcast[],
	pollRates: {
		[POLL_RATES.SEND_HEARTBEAT]: 1000 * 60,
	},
};

const playfab = createSlice({
	name: 'playfab',
	reducers: {
		updateDisplayName: (state, action) => {
			state.DisplayName = action.payload;
		},
		updateAvatarUrl: (state, action) => {
			state.AvatarUrl = action.payload;
		},
		changePollingRate: (state:IPlayfabState, action) => ({
			...state,
			pollRates: {
				...state.pollRates,
				[action.payload.key]: action.payload.rate,
			},
		}),
		updateLocalVirtualCurrency: (state:IPlayfabState, action) => {
			const { currency, amount } = action.payload;

			return {
				...state,
				currencies: {
					...state.currencies,
					[currency]: amount,
				},
			};
		},
	},
	extraReducers: {
		...authPlayfab.reducers,
		...getStoreLoadout.reducers,
		...getLiveBroadcasts.reducers,
		...getVirtualCurrency.reducers,
		...getPlayerCombinedInfo.reducers,
		...sendHeartbeat.reducers,
	},
	initialState,
});

export default playfab;

export const { updateDisplayName, updateAvatarUrl, changePollingRate, updateLocalVirtualCurrency } = playfab.actions;
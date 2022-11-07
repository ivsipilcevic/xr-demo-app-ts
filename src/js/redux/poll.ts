import { createSlice } from '@reduxjs/toolkit';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';
import { instance as playfabXR } from './async/PlayFabXR';
import xrAction from './async/xrAction';

//TODO: ivsi

type IPlayerPollState = typeof initialState;
const initialState = {
  playerPolls: null,
};

export const getPlayerPolls = createDebouncedAsyncAction<IPlayerPollState>(
  'client/getPlayerPoll',
  xrAction(playfabXR.Client.GetPoll),
  {
    fulfilled: (state, action) => {
      return {
        ...state,
        playerPolls: (action.payload?.data?.Polls || []).map((item) => ({
          ...item,
        })),
      };
    },
  }
);

const playerPolls = createSlice({
  name: 'playerPolls',
  reducers: {},
  extraReducers: {
    ...getPlayerPolls.reducers,
  },
  initialState,
});

export default playerPolls;

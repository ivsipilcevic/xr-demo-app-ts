import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { reportApiError } from '../../utils/reportApiError';
import { IAppDispatch } from '../config/store';
import { incrementErrors } from '../env';
import PlayFabXR from './PlayFabXR';

type Config = { dispatch:IAppDispatch, state:unknown, rejectValue:unknown };

type StackActionPromise<Returned, ThunkArgs> = (args:ThunkArgs) => Promise<Returned>;

export default function xrAction<ActionType, ThunkArgs>(
	promise:StackActionPromise<ActionType, ThunkArgs>,
):AsyncThunkPayloadCreator<ActionType, ThunkArgs, Config> {
	return (data, { dispatch, rejectWithValue }) => {
		return promise(data).then((resp:ActionType & { code: number, success: boolean }) => {
			if (resp.code === 401 || resp.code === 409) {
				PlayFabXR.resetAuthCookies();
				window.location.reload();
				console.error('LOGGED OUT');
			} else if (!resp.success) {
				dispatch(incrementErrors());
				reportApiError('PlayfabAPI', resp);
				return rejectWithValue(resp);
			}
		
			return resp;
		});
	};
}

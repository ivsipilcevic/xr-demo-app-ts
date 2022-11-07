
// @ts-check
import sha1 from 'sha1';
import { Action, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit';
import { IAppDispatch } from '../config/store';
import { AsyncThunkFulfilledActionCreator, AsyncThunkPayloadCreator, AsyncThunkPendingActionCreator, AsyncThunkRejectedActionCreator } from '@reduxjs/toolkit/dist/createAsyncThunk';

type IReducerStates = 'pending' | 'fulfilled' | 'rejected';
type IUserReducer<StateType, ActionType> = (state:StateType, action: { meta:any, payload: ActionType }) => StateType | void;
type IUserReducers<StateType, ActionType = StateType | void> = Partial<Record<IReducerStates, IUserReducer<StateType, ActionType>>>;

/**
	Creates a thunk action that cannot be called with the same parameters before the previous identical one is resolved
	Returns the redux action, with reducers as property, that can be added to extraReducers of slice creator.
*/
export default function createDebouncedAsyncAction<StateType = any, ActionType = any>(
	name:string, payloadCreator: AsyncThunkPayloadCreator<ActionType, any>,
	userReducers:IUserReducers<StateType, ActionType> = {},
) {
	const processing:{ [key:string]: Promise<any> | null } = {};
	const thunk = createAsyncThunk(
		name,
		payloadCreator,
	);
	
	const debounced = (data = {}) => {
		return (dispatch:IAppDispatch) => {
			const hash = sha1(JSON.stringify(data || {}));
			if (Boolean(processing[hash])) {
				return processing[hash];
			}
			
			processing[hash] = dispatch(thunk(data as any)).then(r => {
				processing[hash] = null;
				return r;
			}).catch(err => {
				processing[hash] = null;
				throw err;
			});
			return processing[hash];
		};
	};

	debounced.actionName = name;
	
	debounced.actions = thunk;

	debounced.reducers = Object.entries(userReducers).reduce((carry, [key, reducer]) => {
		carry[thunk[key as IReducerStates].type] = reducer;
		return carry;
	}, {} as {
		rejected?: AsyncThunkRejectedActionCreator<StateType, ActionType>,
		pending?: AsyncThunkPendingActionCreator<StateType, ActionType>,
		fulfilled?: AsyncThunkFulfilledActionCreator<StateType, ActionType>,
	}) as {
		[T in keyof IReducerStates]: IReducerStates[T] extends Action ? CaseReducer<StateType, IReducerStates[T]> : void;
	};

	return debounced;
}
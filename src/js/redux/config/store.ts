import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AnyAction } from 'redux';
import { createLogger } from 'redux-logger';

import tracker from './middleware/tracker';

import { EXCLUDED_LOGGER_ACTIONS } from '../../Constants';
import { rootReducer } from '../rootReducer';

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = ThunkDispatch<IRootState, any, AnyAction>;

export const useAppDispatch = () => useDispatch<IAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

function filterActions(getState, action) {
	if (EXCLUDED_LOGGER_ACTIONS.find(x => action.type.indexOf(x) >= 0)) return false;
	return true;
}

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => {
		const middleware = getDefaultMiddleware();

		middleware.push(createLogger({ collapsed: true, predicate: filterActions }));

		middleware.push(tracker);

		return middleware;
	},
});

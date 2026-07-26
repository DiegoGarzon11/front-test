// src/app/store.ts

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '../features/checkout/checkoutSlice';
import { loadState, saveState } from './persistence';

const rootReducer = combineReducers({
	checkout: checkoutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloadedState = loadState();

export const store = configureStore({
	reducer: rootReducer,
	preloadedState,
});

store.subscribe(() => {
	saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { playfabClientApi } from './async/api';
import createDebouncedAsyncAction from './async/createDebouncedAsyncAction';

export type ChatMessage = {
	TimeStamp: number,
	Guid: string,
	Type: string,
	Payload: {
		Message?: string,
		IsModerated?: boolean,
	},
	DisplayName: string,
	PlayFabId: string,
	Room: string,
};

type IEnvState = typeof initialState;

const initialState = {
	messages: {} as Record<string, ChatMessage[]>,
};

export const sendChatMessage = createDebouncedAsyncAction(
	'chat/sendChatMessage',
	(data = { text: '', room_id: '' }) => {
		return playfabClientApi('ExecuteCloudScript', {
			FunctionName: 'SendChatMessage',
			FunctionParameter: data,
			GeneratePlayStreamEvent: true,
		});
	},
);

const chat = createSlice({
	name: 'chat',
	reducers: {
		addChatMessage: (state:IEnvState, action: PayloadAction<ChatMessage>) => {
			const message = action.payload;
			state.messages[message.Room] = state.messages[message.Room] || [];

			const existing = state.messages[message.Room].find(m => m.Guid === message.Guid);

			message.TimeStamp = new Date(message.TimeStamp).getTime();

			if (existing) {
				console.log('message already exists', message);
				const originalTimestamp = existing.TimeStamp;
				Object.assign(existing, message);
				existing.TimeStamp = originalTimestamp;
			} else {
				state.messages[message.Room].push(message);
			}
		},
	},
	extraReducers: {
		...sendChatMessage.reducers,
	},
	initialState,
});

export default chat;

export const { addChatMessage } = chat.actions;

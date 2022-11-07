import catalog from './catalog';
import chat from './chat';
import env from './env';
import global_variables from './global_variables';
import inventory from './inventory';
import missions from './missions';
import notifications from './notifications';
import other_players from './other_players';
import playfab from './playfab';
import realtime from './realtime';
import statistics from './statistics';
import title_data from './title_data';
import xr_store from './xr_store';
import playerData from './playerData';
import playerPolls from './poll';

export const rootReducer = {
  env: env.reducer,
  playfab: playfab.reducer,
  global_variables: global_variables.reducer,
  catalog: catalog.reducer,
  inventory: inventory.reducer,
  realtime: realtime.reducer,
  statistics: statistics.reducer,
  title_data: title_data.reducer,
  xr_store: xr_store.reducer,
  notifications: notifications.reducer,
  missions: missions.reducer,
  chat: chat.reducer,
  other_players: other_players.reducer,
  playerData: playerData.reducer,
  playerPolls: playerPolls.reducer,
};

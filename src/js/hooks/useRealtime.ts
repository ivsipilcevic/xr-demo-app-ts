import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ENDPOINTS, PLAYFAB_APP_ID } from '../Constants';
import { addChatMessage } from '../redux/chat';
import { IRootState, useAppDispatch } from '../redux/config/store';
import { getItemInventory } from '../redux/inventory';
import { getMissionInventory } from '../redux/missions';
import {
  addNotification,
  getRealtimeNotifications,
} from '../redux/notifications';
import {
  updateAvatarUrl,
  updateDisplayName,
  updateLocalVirtualCurrency,
} from '../redux/playfab';
import { getPlayerPolls } from '../redux/poll';
import { updateLocalStatistic } from '../redux/statistics';
import { getStoreLoadout } from '../redux/xr_store';

import usePlayFab from './usePlayFab';

let eventSource: EventSource = null;

function connect(hubUrl, topics, onMessage) {
  if (eventSource) {
    eventSource.close();
  }

  const url = new URL(hubUrl);

  for (const t in topics) {
    url.searchParams.append('topic', topics[t]);
  }

  eventSource = new EventSource(url);

  eventSource.onerror = (e) => {
    console.error(e);
  };

  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (onMessage) onMessage(data);
  };

  return eventSource;
}

export default function useRealtime() {
  const { versions, playerStatus } = useSelector(
    (state: IRootState) => state.realtime
  );

  const dispatch = useAppDispatch();

  const { playerId } = usePlayFab();

  const onMessage = useCallback(
    (data) => {
      const eventName = data.EventName;
      console.log('! data ', data);
      const additionnalData =
        data?.ExecutionResult?.ExecutionResult?.Result?.data?.FunctionName ||
        data.SegmentName ||
        data.StatisticName ||
        data.DisplayName ||
        data.ActionName ||
        data?.Payload?.Message ||
        data?.challengeId ||
        '';

      console.log(
        '%crealtime ' +
          `%c${eventName} ` +
          `%c${additionnalData ? `[${additionnalData}]` : ''}`,
        'color: #ccc;',
        'color: #ffbca0;',
        'color: teal;'
      );

      switch (eventName) {
        case 'player_statistic_changed':
          dispatch(
            updateLocalStatistic({
              name: data.StatisticName,
              value: data.StatisticValue,
            })
          );
          break;
        case 'player_consumed_item':
        case 'player_inventory_item_added':
          dispatch(getItemInventory());
          break;
        case 'player_virtual_currency_balance_changed':
          dispatch(
            updateLocalVirtualCurrency({
              currency: data.VirtualCurrencyName,
              amount: data.VirtualCurrencyBalance,
            })
          );
          break;
        case 'player_displayname_changed':
          dispatch(updateDisplayName(data.DisplayName));
          break;
        case 'player_changed_avatar':
          dispatch(updateAvatarUrl(data.ImageUrl));
          break;
        case 'player_notification_pushed':
          dispatch(getRealtimeNotifications(playerId));
          break;
        case 'store':
        case 'player_store_cleared':
          dispatch(getStoreLoadout());
          break;
        case 'notifications':
          dispatch(addNotification(data));
          break;
        case 'player_objective_progress':
        case 'player_objective_completed':
          dispatch(getMissionInventory());
          break;
        case 'xr_chat_message':
          dispatch(addChatMessage(data));
          break;
        case 'player_poll_instantiated':
          console.log('HEY, you should really check that new poll!');
          dispatch(getPlayerPolls());
          break;
      }
    },
    [playerId]
  );

  useEffect(() => {
    let connection;
    if (playerId) {
      connection = connect(
        ENDPOINTS.REALTIME_EVENT_SOURCE,
        [
          `playstream/${PLAYFAB_APP_ID}/${playerId}`,
          `playstream/${PLAYFAB_APP_ID}`,
        ],
        onMessage
      );
    }

    return () => {
      connection?.close();
    };
  }, [playerId]);

  return {
    newsVersion: versions.news,
    playerStatus,
  };
}

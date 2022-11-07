import { toUrlEncoded } from '../../utils/toUrlEncoded';
import { AS_STACK_APP_ID, ENDPOINTS } from '../../Constants';
import { getCookie, setCookie } from '../../utils/cookies';

export const SESSION_TICKET_COOKIE_KEY =
  AS_STACK_APP_ID + '_PLAYFABXR_SESSION_TICKET';
export const PLAYFABID_COOKIE_KEY = AS_STACK_APP_ID + '_PLAYFABXR_PLAYFABID';
export const ENTITY_TOKEN_COOKIE_KEY =
  AS_STACK_APP_ID + '_PLAYFABXR_ENTITY_TOKEN';

class PlayFabXR {
  static instances: Record<string, PlayFabXR> = {};

  private sessionTicket = getCookie(SESSION_TICKET_COOKIE_KEY);

  private playfabId = getCookie(PLAYFABID_COOKIE_KEY);

  private entityToken = getCookie(ENTITY_TOKEN_COOKIE_KEY);

  private defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  private constructor(private appId: string) {}

  public static GetInstance(appId: string): PlayFabXR {
    if (!PlayFabXR.instances[appId]) {
      PlayFabXR.instances[appId] = new PlayFabXR(appId);
    }

    return PlayFabXR.instances[appId];
  }

  public GetPlayFabId() {
    return this.playfabId;
  }

  public GetSessionTicket() {
    return this.sessionTicket;
  }

  public GetEntityToken() {
    return this.entityToken;
  }

  private apiCall<T>(
    endpoint: string,
    data: Record<string, string | number>,
    headers: Record<string, string>
  ): Promise<GenericApiCallResponse<T>> {
    // console.log(endpoint, data, new Date().toISOString());

    return fetch(
      './proxy.php?endpoint=' +
        encodeURIComponent(ENDPOINTS.STACK_API + endpoint),
      {
        method: 'POST',
        body: toUrlEncoded(data),
        headers: { ...this.defaultHeaders, ...headers },
      }
    )
      .then((response) => response.json())
      .then((json: GenericApiCallResponse<T>) => json);
  }

  private onAuth(response: GenericApiCallResponse<AuthResponse>) {
    if (response) {
      this.sessionTicket = response.data.LoginResult.SessionTicket;
      this.entityToken = response.data.LoginResult.EntityToken.EntityToken;
      this.playfabId = response.data.LoginResult.PlayFabId;

      setCookie(SESSION_TICKET_COOKIE_KEY, this.sessionTicket);
      setCookie(ENTITY_TOKEN_COOKIE_KEY, this.entityToken);
      setCookie(PLAYFABID_COOKIE_KEY, this.playfabId);
    }

    return response;
  }

  static resetAuthCookies = () => {
    setCookie(SESSION_TICKET_COOKIE_KEY, '');
    setCookie(ENTITY_TOKEN_COOKIE_KEY, '');
    setCookie(PLAYFABID_COOKIE_KEY, '');
  };

  private AuthHeaders = { 'X-App-Id': this.appId };

  public Auth = {
    RegisterPlayFabUser: (
      data: { username: string; email: string; password: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/RegisterPlayFabUser',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithPlayFab: (
      data: { username: string; password: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithPlayFab',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithEmailAddress: (
      data: { email: string; password: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithEmailAddress',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithCustomID: (
      data: { CustomId: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithCustomID',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithJWT: (data: { JWT: string }, headers = this.AuthHeaders) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithJWT',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithTwitchExtension: (
      data: { JWT: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithTwitchExtension',
        data,
        headers
      ).then((resp) => this.onAuth(resp));
    },
    LoginWithTwitch: (
      data: { AccessToken: string },
      headers = this.AuthHeaders
    ) => {
      return this.apiCall<AuthResponse>(
        '/auth/LoginWithTwitch',
        { ...data, UseCustomId: 1 },
        headers
      ).then((resp) => this.onAuth(resp));
    },
    Logout: () => {
      setCookie(SESSION_TICKET_COOKIE_KEY, '');
      setCookie(ENTITY_TOKEN_COOKIE_KEY, '');
      setCookie(PLAYFABID_COOKIE_KEY, '');

      return Promise.resolve({
        code: 200,
        message: 'Logout successful',
        data: {},
      } as GenericApiCallResponse<any>);
    },
  };

  private GetClientHeaders = () => ({
    'X-App-Id': this.appId,
    'X-Authentication': this.sessionTicket,
    'X-EntityToken': this.entityToken,
  });

  public Client = {
    // App Data
    GetGlobalVariable: (data: { key?: string } = {}) => {
      return this.apiCall<GetGlobalVariableResponse>(
        '/client/GetGlobalVariable',
        data,
        this.GetClientHeaders()
      );
    },

    //Player Profile
    GetUserData: () => {
      return this.apiCall<GetUserDataResponse>(
        '/client/GetUserData',
        {},
        this.GetClientHeaders()
      );
    },

    GetPoll: () => {
      return this.apiCall('/client/GetPoll', {}, this.GetClientHeaders());
    },

    //TODO: ivsi
    AnswerPoll: (data: { InstanceId: string; AnswerId: string }) => {
      return this.apiCall('/client/AnswerPoll', data, this.GetClientHeaders());
    },

    GetPlayedTitleList: () => {
      return this.apiCall<GetPlayedTitleListResponse>(
        '/client/GetPlayedTitleList',
        {},
        this.GetClientHeaders()
      );
    },
    GetPlayerStatistics: () => {
      return this.apiCall<GetPlayerStatisticsResponse>(
        '/client/GetPlayerStatistics',
        {},
        this.GetClientHeaders()
      );
    },
    GetPlayerProfile: (
      data: { PlayFabId?: string } = { PlayFabId: this.playfabId }
    ) => {
      return this.apiCall<GetPlayerProfileResponse>(
        '/client/GetPlayerProfile',
        data,
        this.GetClientHeaders()
      );
    },

    //Inventory
    UnlockContainerItem: (data: { ContainerItemId: string }) => {
      return this.apiCall<UnlockContainerItemResponse>(
        '/client/UnlockContainerItem',
        data,
        this.GetClientHeaders()
      );
    },
    OpenDropChest: (data: { ContainerItemId: string; Amount: number }) => {
      return this.apiCall<OpenDropChestResponse>(
        '/client/OpenDropChest',
        data,
        this.GetClientHeaders()
      );
    },
    GetVirtualCurrency: (data: { CurrencyCode?: string } = {}) => {
      return this.apiCall<GetVirtualCurrencyResponse>(
        '/client/GetVirtualCurrency',
        data,
        this.GetClientHeaders()
      );
    },
    GetItemInventory: () => {
      return this.apiCall<GetItemInventoryResponse>(
        '/client/GetItemInventory',
        {},
        this.GetClientHeaders()
      );
    },
    GetItemData: (data: { ItemId: string }) => {
      return this.apiCall<GetItemDataResponse>(
        '/client/GetItemData',
        data,
        this.GetClientHeaders()
      );
    },
    GetItemCatalog: (data: { ItemClass?: string } = {}) => {
      return this.apiCall<GetItemCatalogResponse>(
        '/client/GetItemCatalog',
        data,
        this.GetClientHeaders()
      );
    },
    AcquireCatalogItem: (data: { ItemId: string }) => {
      return this.apiCall<AcquireCatalogItemResponse>(
        '/client/AcquireCatalogItem',
        data,
        this.GetClientHeaders()
      );
    },
    ConsumeItem: (data: { ItemInstanceId: string; ConsumeCount: number }) => {
      return this.apiCall<ConsumeItemResponse>(
        '/client/ConsumeItem',
        data,
        this.GetClientHeaders()
      );
    },

    //Missions
    GetMissionInventory: () => {
      return this.apiCall<GetMissionInventoryResponse>(
        '/client/GetMissionInventory',
        {},
        this.GetClientHeaders()
      );
    },
    GetMissionData: (data: { ItemId: string }) => {
      return this.apiCall<GetMissionDataResponse>(
        '/client/GetMissionData',
        data,
        this.GetClientHeaders()
      );
    },
    SendMissionInput: (data: {
      ItemId: string;
      Input: string;
      ObjectiveId?: string;
      Context?: string;
    }) => {
      return this.apiCall<SendMissionInputResponse>(
        '/client/SendMissionInput',
        data,
        this.GetClientHeaders()
      );
    },
    ResetMission: (data: { ItemId: string }) => {
      return this.apiCall<[]>(
        '/client/ResetMission',
        data,
        this.GetClientHeaders()
      );
    },

    //Custom Events
    WritePlayerEvent: (data: { EventName: string; Body?: string }) => {
      return this.apiCall<WritePlayerEventResponse>(
        '/client/WritePlayerEvent',
        data,
        this.GetClientHeaders()
      );
    },

    //Telemetry
    WriteTelemetryEvent: (data: {
      Namespace: string;
      Name: string;
      Payload: string | { [key: string | number]: any };
    }) => {
      const formattedPayload =
        typeof data.Payload === 'string'
          ? data.Payload
          : JSON.stringify(data.Payload);
      return this.apiCall<WriteTelemetryEventResponse>(
        '/client/WriteTelemetryEvent',
        { ...data, Payload: formattedPayload },
        this.GetClientHeaders()
      );
    },

    //Transition
    GetFormula: (data: { FormulaId?: number } = {}) => {
      return this.apiCall<GetFormulaResponse>(
        '/client/GetFormula',
        data,
        this.GetClientHeaders()
      );
    },
    ExecuteFormula: (data: { FormulaId?: number } = {}) => {
      return this.apiCall<ExecuteFormulaResponse>(
        '/client/ExecuteFormula',
        data,
        this.GetClientHeaders()
      );
    },

    //Store
    GetStoreLoadout: () => {
      return this.apiCall<GetStoreLoadoutResponse>(
        '/client/GetStoreLoadout',
        {},
        this.GetClientHeaders()
      );
    },
    PurchaseStoreItem: (data: { TileId: string; CurrencyCode: string }) => {
      return this.apiCall<PurchaseStoreItemResponse>(
        '/client/PurchaseStoreItem',
        data,
        this.GetClientHeaders()
      );
    },
    RefreshStoreTile: (data: { TileId: string }) => {
      return this.apiCall<RefreshStoreTileResponse>(
        '/client/RefreshStoreTile',
        data,
        this.GetClientHeaders()
      );
    },
    PurchaseStoreReset: (data: { SectionId: number }) => {
      return this.apiCall<PurchaseStoreResetResponse>(
        '/client/PurchaseStoreReset',
        data,
        this.GetClientHeaders()
      );
    },

    //Leaderboards and Stats
    GetInstanceLeaderboard: (data: {
      CustomInstanceId: string;
      StatName: string;
    }) => {
      return this.apiCall<GetInstanceLeaderboardResponse>(
        '/client/GetInstanceLeaderboard',
        data,
        this.GetClientHeaders()
      );
    },
    GetInstanceStat: (data: { CustomInstanceId: string; StatName: string }) => {
      return this.apiCall<GetInstanceStatResponse>(
        '/client/GetInstanceStat',
        data,
        this.GetClientHeaders()
      );
    },
    GetAppStat: (data: { StatName?: string }) => {
      return this.apiCall<GetAppStatResponse>(
        '/client/GetAppStat',
        data,
        this.GetClientHeaders()
      );
    },

    //Friend List
    GetFriendsList: () => {
      return this.apiCall<GetFriendsListResponse>(
        '/client/GetFriendsList',
        {},
        this.GetClientHeaders()
      );
    },
    SendFriendRequest: (data: { FriendId: string; TokenItemId: string }) => {
      return this.apiCall<SendFriendRequestResponse>(
        '/client/SendFriendRequest',
        data,
        this.GetClientHeaders()
      );
    },
    AcceptFriendRequest: (data: { TokenId: string }) => {
      return this.apiCall<[]>(
        '/client/AcceptFriendRequest',
        data,
        this.GetClientHeaders()
      );
    },
    DeclineFriendRequest: (data: { TokenId: string }) => {
      return this.apiCall<[]>(
        '/client/DeclineFriendRequest',
        data,
        this.GetClientHeaders()
      );
    },
    AddFriend: (data: { FriedId: string }) => {
      return this.apiCall<AddFriendResponse>(
        '/client/AddFriend',
        data,
        this.GetClientHeaders()
      );
    },
    RemoveFriend: (data: { FriedId: string }) => {
      return this.apiCall<[]>(
        '/client/RemoveFriend',
        data,
        this.GetClientHeaders()
      );
    },

    // Twitch
    GetTwitchChannelData: (
      data: { PlayFabId?: string; TwitchId?: string } = {}
    ) => {
      return this.apiCall<GetTwitchChannelDataResponse>(
        '/client/twitch/GetTwitchChannelData',
        data,
        this.GetClientHeaders()
      );
    },

    // Predictions
    GetPredictions: () => {
      return this.apiCall<GetPredictionsResponse>(
        '/client/prediction/GetList',
        {},
        this.GetClientHeaders()
      );
    },
  };

  public Service = {
    // Twitch
    GetLiveBroadcast: (data: { TimeRange: number } = { TimeRange: 5 }) => {
      return this.apiCall<GetLiveBroadcastResponse>(
        '/service/GetLiveBroadcast',
        data,
        this.GetClientHeaders()
      );
    },
  };
}

export default PlayFabXR;

export const instance = PlayFabXR.GetInstance(AS_STACK_APP_ID);

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

type IPlayFabInventoryItemId = `i-${number}-${number}`;
type IPlayFabXRItemState = 'draft' | 'staging' | 'released';
type IPlayFabInventoryItemInstanceData = {
	[key: string]: string,
};

interface IPlayFabCatalogItemConsumableInfo {
	/** number of times this object can be used, after which it will be removed from the player inventory */
	UsageCount: string,
	/** duration in seconds for how long the item will remain in the player inventory - once elapsed, the item will be removed (recommended minimum value is 5 seconds, as lower values can cause the item to expire before operations depending on this item's details have completed) */
	UsagePeriod: number,
	/** all inventory item instances in the player inventory sharing a non-null UsagePeriodGroup have their UsagePeriod values added together, and share the result - when that period has elapsed, all the items in the group will be removed */
	UsagePeriodGroup: string,
}

interface IPlayFabCatalogItemBundleInfo {
	/** unique ItemId values for all items which will be added to the player inventory when the bundle is added */
	BundledItems: string[],
	/** unique TableId values for all RandomResultTable objects which are part of the bundle (random tables will be resolved and add the relevant items to the player inventory when the bundle is added) */
	BundledResultTables: string[],
	/** virtual currency types and balances which will be added to the player inventory when the bundle is added */
	BundledVirtualCurrencies: {
		[key: string]: number,
	}
}

interface IPlayFabCatalogItemContainerInfo {
	/** unique ItemId values for all items which will be added to the player inventory, once the container has been unlocked */
	ItemContents: string[],
	/** ItemId for the catalog item used to unlock the container, if any (if not specified, a call to UnlockContainerItem will open the container, adding the contents to the player inventory and currency balances) */
	KeyItemId: string,
	/** unique TableId values for all RandomResultTable objects which are part of the container (once unlocked, random tables will be resolved and add the relevant items to the player inventory) */
	ResultTableContents: string[],
	/** virtual currency types and balances which will be added to the player inventory when the container is unlocked */
	VirtualCurrencyContents: {
		[key: string]: number,
	}
}

/** A purchasable item from the item catalog */
interface IPlayFabCatalogItem {
	/** defines the bundle properties for the item - bundles are items which contain other items, including random drop tables and virtual currencies */
	Bundle: IPlayFabCatalogItemBundleInfo,
	/** if true, then an item instance of this type can be used to grant a character to a user. */
	CanBecomeCharacter: boolean,
	/** catalog version for this item */
	CatalogVersion: string,
	/** defines the container properties for the item - what items it contains, including random drop tables and virtual currencies, and what item (if any) is required to open it via the UnlockContainerItem API */
	Container: IPlayFabCatalogItemContainerInfo,
	/** game specific custom data */
	CustomData: string,
	/** text description of item, to show in-game */
	Description: string,
	/** text name for the item, to show in-game */
	DisplayName: string,
	/** If the item has IsLImitedEdition set to true, and this is the first time this ItemId has been defined as a limited edition item, this value determines the total number of instances to allocate for the title. Once this limit has been reached, no more instances of this ItemId can be created, and attempts to purchase or grant it will return a Result of false for that ItemId. If the item has already been defined to have a limited edition count, or if this value is less than zero, it will be ignored. */
	InitialLimitedEditionCount: number,
	/** BETA: If true, then only a fixed number can ever be granted. */
	IsLimitedEdition: boolean,
	/** if true, then only one item instance of this type will exist and its remaining uses will be incremented instead. RemainingUses will cap out at Int32.Max (2,147,483,647). All subsequent increases will be discarded */
	IsStackable: boolean,
	/** if true, then an item instance of this type can be traded between players using the trading APIs */
	IsTradable: boolean,
	/** class to which the item belongs */
	ItemClass?: string,
	/** unique identifier for this item */
	ItemId: string,
	/** URL to the item image. For Facebook purchase to display the image on the item purchase page, this must be set to an HTTP URL. */
	ItemImageUrl?: string,
	/** override prices for this item for specific currencies */
	RealCurrencyPrices?: { [key: string]: number },
	/** list of item tags */
	Tags?: string[],
	/** price of this item in virtual currencies and "RM" (the base Real Money purchase price, in USD pennies) */
	VirtualCurrencyPrices?: { [key: string]: number },
}

/**
 * A unique instance of an item in a user's inventory. Note, to retrieve additional information for an item such as Tags,
 * Description that are the same across all instances of the item, a call to GetCatalogItems is required. The ItemID of can
 * be matched to a catalog entry, which contains the additional information. Also note that Custom Data is only set when
 * the User's specific instance has updated the CustomData via a call to UpdateUserInventoryItemCustomData. Other fields
 * such as UnitPrice and UnitCurrency are only set when the item was granted via a purchase.
 */
interface IPlayfabItemInstance {
	/** Game specific comment associated with this instance when it was added to the user inventory. */
	Annotation?: string,
	/** Array of unique items that were awarded when this catalog item was purchased. */
	BundleContents?: string[],
	/**
	 * Unique identifier for the parent inventory item, as defined in the catalog, for object which were added from a bundle or
	 * container.
	 */
	BundleParent?: string,
	/** Catalog version for the inventory item, when this instance was created. */
	CatalogVersion?: string,
	/**
	 * A set of custom key-value pairs on the instance of the inventory item, which is not to be confused with the catalog
	 * item's custom data.
	 */
	CustomData?: { [key: string]: string | null },
	/** CatalogItem.DisplayName at the time this item was purchased. */
	DisplayName?: string,
	/** Timestamp for when this instance will expire. */
	Expiration?: string,
	/** Data that is unique to this item's instance */
	InstanceData?: IPlayFabInventoryItemInstanceData
	/** Class name for the inventory item, as defined in the catalog. */
	ItemClass?: string,
	/** Unique identifier for the inventory item, as defined in the catalog. */
	ItemId?: string,
	/** Unique item identifier for this specific instance of the item. */
	ItemInstanceId?: string,
	/** Timestamp for when this instance was purchased. */
	PurchaseDate?: string,
	/** Total number of remaining uses, if this is a consumable item. */
	RemainingUses?: number,
	/** Currency type for the cost of the catalog item. Not available when granting items. */
	UnitCurrency?: string,
	/** Cost of the catalog item in the given currency. Not available when granting items. */
	UnitPrice: number,
	/** The number of uses that were added or removed to this item in this call. */
	UsesIncrementedBy?: number,
}

type IXRItemPlayFabData = IPlayFabCatalogItem & IPlayfabItemInstance;

interface IXRInventoryItem {
	itemId: IPlayFabInventoryItemId,
	state: IPlayFabXRItemState,
	id: number,
	type: IXRInventoryItemType,
	playfab: IXRItemPlayFabData,
	data: {
		dataKey: string,
		dataVal: string,
	}[]
}

interface IXRInventoryItemParsedData extends Omit<IXRInventoryItem, 'data'> {
	data: {
		[key: string]: string | number | boolean,
	}
}

interface IXRInventoryItemType {
	title: string,
	id: number,
	layoutColor: string,
	layoutIcon: string,
	classType: string
}


interface IXRMissionItem {
	itemId: string,
	id: number,
	type: {
		title: string,
		id: number,
		isCommunity: boolean,
		layoutColor: string,
		layoutIcon: string
	},
	publicData: Record<string, unknown>,
	data: Record<string, unknown>,
	objectives: IXRMissionObjective[],
	rewards: [],
	playfab: IXRItemPlayFabData,
	state: string,
	listed: boolean,
	replayable: boolean,
	repeatable: boolean,
	PlayerStatus?: {
		IsComplete: boolean,
		TotalCompleted: number,
		Total: number,
		Percent: number,
	},
}

type IXRMissionObjective = {
	id: number,
	type: {
		title: string
	},
	data: Record<string, unknown>,
	rewards: IXRMissionReward[],
	title: string,
	PlayerStatus?: {
		IsComplete: boolean,
		Trackers: {
			TriggerId: string,
			Threshold: number,
			Value: number,
		}[],
	}
};

type IXRMissionReward = {
	dataType: string,
	dataKey: string,
	dataVal: number,
	id: number
};

interface IXRFormulaCommodity {
	amount: number,
	commodityDefinitionId: string,
	item?: IXRInventoryItem,
	hasEnough?: boolean,
	rules: string[],
}

interface IXRFormulaCommodityParsedData extends Omit<IXRFormulaCommodity, 'item'> {
	item?: IXRInventoryItemParsedData,
}

interface IXRFormulaDefinition {
	id: number,
	ingredients: IXRFormulaCommodity[],
	name: string,
	rewards: IXRFormulaCommodity[],
	rules: string[],
	tags: string[],
	canBeCrafted?: boolean,
}

interface IXRFormulaDefinitionParsedData extends Omit<IXRFormulaDefinition, 'rewards' | 'ingredients'> {
	ingredients: IXRFormulaCommodityParsedData[],
	rewards: IXRFormulaCommodityParsedData[],
}

interface IXRNewsItem {
	news_id: string,
	timestamp: string,
	title: string,
	text: string,
	publish_date: string,
	release_date: string,
	notification_text: string,
	background_image: string,
	button1_label: string,
	button1_url: string,
	button2_label: string,
	button2_url: string,
	game_logo: string,
	sound_file: string,
}

interface IXRRealtimeNotification {
	id: string,
	app_id: string,
	notification_id: string,
	title: string,
	icon: string,
	/** @deprecated  */
	text?: string,
	message: string,
	link: string,
	timestamp: string,
}

interface IXRAppStat {
	statName: string,
	statValue: number
}

interface IBroadcast {
	channelData: {
		PlayfabId: string,
		TwitchUsername: string,
		TwitchDisplayName: string,
		TwitchProfileImageUrl: string,
		TwitchId: string,
	},
	currentMission: string,
	viewers: number,
	streamUrl: string,
}

interface IPlayFabStatistic {
	StatisticName: string,
	Value: number,
	Version: number,
}


interface IXRStoreTile {
	id: string,
	status: string,
	displayCurrency: string,
	offerType: string,
	offerValue: string,
	skin: string,
	discount: number,
	regularPrice: number,
	discountPrice: number,
	limitedEdition: number,
	totalPurchase: number,
	purchaseCount: number,
	maxPurchase: number,
	customPayload: any,
	playfab: IPlayfabItemInstance,
	content: IPlayFabCatalogItem,
}

interface IXRStore {
	id: number,
	name: string,
	refeshOptions: null,
	tiles: IXRStoreTile[]
}

interface IXRFriend {
	FacebookInfo: any,
	FriendPlayFabId: string,
	TitleDisplayName: string,
}


// API CALLS


type GenericApiCallResponse<T> = {
	code: number,
	message: string,
	success: boolean,
	data: T,
};
interface AuthResponse {
	LoginResult: {
		SessionTicket: string,
		PlayFabId: string,
		NewlyCreated: boolean,
		SettingsForUser: {
			NeedsAttribution: boolean,
			GatherDeviceInfo: boolean,
			GatherFocusInfo: boolean,
		},
		LastLoginTime: string,
		EntityToken: {
			EntityToken: string,
			TokenExpiration: string,
			Entity: {
				Id: string,
				Type: string,
				TypeString: string,
			}
		},
		TreatmentAssignment: {
			Variants: [],
			Variables: [],
		},
	}
}

interface GetGlobalVariableResponse {
	GlobalVariables: {
		dataKey: string,
		dataVal: any,
	}[]
}

interface GetUserDataResponse {
	[key: string]: string | number | boolean | [],
}

interface GetPlayedTitleListResponse {
	GetPlayerTitleListResult: {
		TitleIds: string[]
	}
}

interface GetPlayerStatisticsResponse {
	Statistics: IPlayFabStatistic[]
}

interface GetPlayerProfileResponse {
	Profile: {
		AvatarUrl: string,
		PublisherId: string,
		TitleId: string,
		PlayerId: string,
		Created: string,
		Origination: string,
		LastLogin: string,
		DisplayName: string,
		Tags: string[],
		LinkedAccounts: {
			Platform: string,
			PlatformUserId: string,
		}[],
		Statistics: { Name:string, Value:number }[]
	}
}

interface UnlockContainerItemResponse {
	items: {
		ItemId: string,
		ItemInstanceId: string,
		ItemClass: string,
		PurchaseDate: string,
		RemainingUses: number,
		UsesIncrementedBy: number,
		CatalogVersion: string,
		DisplayName: string,
		UnitPrice: number,
	}[]
}

interface OpenDropChestResponse {
	GrantedItems: IPlayfabItemInstance[],
	GrantedVirtualCurrency: [],
}

interface GetVirtualCurrencyResponse {
	VirtualCurrencies?: {
		[key: string]: number,
	}
	VirtualCurrency?: {
		[key: string]: number,
	}
}

interface IXRApiErrorResponse {
	error: string,
	errorInfo: any,
}

interface GetItemInventoryResponse extends Partial<IXRApiErrorResponse> {
	items: IXRInventoryItem[],
}

interface GetItemDataResponse extends Partial<IXRApiErrorResponse> {
	item: IXRInventoryItem,
}

interface GetItemCatalogResponse extends Partial<IXRApiErrorResponse> {
	Catalog: IXRInventoryItem[],
}

interface AcquireCatalogItemResponse extends Partial<IXRApiErrorResponse> {
	Items: {
		ItemId: string,
		ItemInstanceId: string,
		ItemClass: string,
		PurchaseDate: string,
		RemainingUses: number,
		UsesIncrementedBy: number,
		CatalogVersion: string,
		DisplayName: string,
		UnitPrice: number,
	}[]
}

interface ConsumeItemResponse extends Partial<IXRApiErrorResponse> {
	ConsumeItemResult: {
		ItemInstanceId: string,
		RemainingUses: number,
	}
}

interface GetMissionInventoryResponse extends Partial<IXRApiErrorResponse> {
	missions: {
		CommunityMissions: IXRMissionItem[],
		PlayerMissions: IXRMissionItem[],
	},
}

interface GetMissionDataResponse extends Partial<IXRApiErrorResponse> {
	mission: IXRMissionItem,
}

interface SendMissionInputResponse extends Partial<IXRApiErrorResponse> {
	Result: {
		ObjectiveId: number,
		ObjectiveRewards: [],
		MissionRewards: [],
	},
	PlayerStatus: {
		IsComplete: boolean,
		TotalCompleted: number,
		Total: number,
		Percent: number,
	},
	PlayFabStatus: {
		BatchSize: number,
		BatchErrors: any,
	}
}

interface WritePlayerEventResponse extends Partial<IXRApiErrorResponse> {
	EventResponse: {
		EventId: string,
	}
}

interface WriteTelemetryEventResponse extends Partial<IXRApiErrorResponse> {
	WriteResults: {
		AssignedEventIds: string[]
	}
}

interface GetFormulaResponse extends Partial<IXRApiErrorResponse> {
	FormulaDefinition?: IXRFormulaDefinition,
	FormulaDefinitions?: IXRFormulaDefinition[],
}

interface ExecuteFormulaResponse extends Partial<IXRApiErrorResponse> {
	ConsumedItems: {
		ItemInstancesId: string,
		RemainingUses: number,
	}[],
	GrantedItems: IXRInventoryItem[]
	GrantedCurrencies: [],
	Errors: [],
}

interface GetStoreLoadoutResponse extends Partial<IXRApiErrorResponse> {
	StoreLoadout: IXRStore[]
}

interface PurchaseStoreItemResponse extends Partial<IXRApiErrorResponse> {
	TileStatus: string,
	PurchaseCount: number,
	MaxPurchase: number,
	ItemGrantResults: IPlayfabItemInstance[],
	CurrencyGrantedResults: [],
	RequiresRefresh: boolean,
}

interface RefreshStoreTileResponse extends Partial<IXRApiErrorResponse> {
	StoreTile: IXRStoreTile,
}

interface PurchaseStoreResetResponse extends Partial<IXRApiErrorResponse> {
	ModifyCurrencyResults: {
		PlayFabId: string,
		VirtualCurrency: string,
		BalanceChange: number,
		Balance: number,
	},
	RefreshedTiles: IXRStoreTile[],
}

interface GetInstanceLeaderboardResponse extends Partial<IXRApiErrorResponse> {
	[key: string]: any,
}

interface GetInstanceStatResponse extends Partial<IXRApiErrorResponse> {
	[key: string]: any,
}

interface GetAppStatResponse extends Partial<IXRApiErrorResponse> {
	AppStats?: IXRAppStat[],
	AppStat?: IXRAppStat,
}

interface GetFriendsListResponse extends Partial<IXRApiErrorResponse> {
	FriendsList: IXRFriend[],
	FriendsRequests: [],
}

interface SendFriendRequestResponse extends Partial<IXRApiErrorResponse> {
	RequestSent: true,
	TokenId: string,
}

interface AddFriendResponse extends Partial<IXRApiErrorResponse> {
	Created: boolean
}

interface GetLiveBroadcastResponse extends Partial<IXRApiErrorResponse> {
	Broadcasts: IBroadcast[],
}
interface GetTwitchChannelDataResponse extends Partial<IXRApiErrorResponse> {
	ChannelData: {
		PlayFabId: string,
		TwitchId: string,
		TwitchDisplayName: string,
		TwitchProfileImageUrl: string,
		TwitchUsername: string,
	}
}

interface IDate {
	offset: number,
	timestamp: number,
	timezone: {
		location: {
			latitude: number,
			longitude: number,
			country_code: string,
			comments: string,
		},
		name: string,
	}
}

interface IPrediction {
	challengeId: string,
	jsonUrl: string,
	publishedOn: IDate,
	result: null,
	updatedOn: IDate,
}

interface GetPredictionsResponse extends Partial<IXRApiErrorResponse> {
	items: IPrediction[],
}
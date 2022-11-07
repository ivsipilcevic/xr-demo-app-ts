type Friend = {
	PLayFabId: string
	DisplayName: string,
	AvatarUrl: string,
	LastOnline: string,
	Status: string,
	WatchParty: string,
	IsOnline: boolean,
};

type Match = {
	BackgroundImage: string,
	Team1Name: string,
	Team1Score?: string,
	Team2Name: string,
	Team2Score?: string,
	Buttons?: [
		{
			Label: string,
			Link: string,
		},
		{
			Label: string,
			Link: string,
		},
	],
};

type Schedule = {
	Title: string,
	Matches: Match[],
};

type HomePageData = {
	BackgroundImage: string,
	UpcomingMatch: {
		Date: string,
		Team1: string,
		Vs: string,
		ButtonLabel: string,
		ButtonLink: string,
		Team2: string,
	},
	FavoriteTeam: {
		Title: string,
		Text: string,
		Logo: string,
		Link: string,
	},
	NewsFeed: {
		Type: string,
		BackgroundImage: string,
		Title: string,
		Info: string,
		Comments: string,
		Likes: string,
		Link: string,
	}[]
};

type MediaPageData = {
	PageTitle: string,
	PageUpperTitle: string,
	BackgroundImage: string,
	Featured: {
		BackgroundImage: string,
		Title: string,
		Subtitle: string,
		ButtonLabel: string,
		ButtonLink: string,
	},
	FriendsTitle: string,
	Friends: Friend[],
	LatestResultsTitle: string,
	LatestResults: {
		Title: string,
		Results: Match[],
	},
	Schedules: Schedule[],
};

type ProfileData = {
	BackgroundImage: string,
};

type MatchData = {
	Hls: string,
	Overlay: string,
	TimeOffset: string,
	AccountId: string,
	ProgramId: string,
	BackgroundImage: string,
	HighlightMatchUrl?: string,
};

type AppSettings = {
	Sport: string,
	MatchLength: number,
};

type StoreData = {
	ActiveSlides: number[],
	Slides: {
		Id: number,
		Title: string,
		Text: string,
		ButtonLabel: string,
		ButtonLink: string,
		BackgroundImage: string,
		StoreCategories: {
			Name: string,
			SectionId: number,
		}[],
	}[],
};

type OverrideItem = IXRInventoryItemParsedData & {
	data: {
		GlobalVariableName: string,
		Value: any,
	}
};

type Badge = IXRInventoryItemParsedData & {
	data: {
		Icon: string,
		Rarity: string,
	},
	isInInventory: boolean
};

type INotification = {
	id: number,
	type: string,
	text: string,
	creation: number,
};

type QuestionChoice = {
	id: string,
	displayName: string,
	code: string,
	answerText?: string,
	customData: Record<string, string | number | boolean>,
};

type QuestionInput = {
	id: string,
	displayName: string,
	code: string,
	answerText?: string,
	type: 'number' | 'text',
	customData: Record<string, string | number | boolean>,
};

type Question = {
	id: string,
	index: number,
	template: string,
	question: string,
	customData: {
		answer_title: string,
		upperTitle: string,
	} & Record<string, string | number | boolean>,
	answerText: string,
	choices?: QuestionChoice[],
	inputs?: QuestionInput[],
	result?: {
		id: string,
		question: string,
		result: QuestionResult,
		type: string,
	},
};

type QuestionResult = {
	id: string,
	code: string,
};

type Challenge = {
	id: string,
	displayName: string,
	endDate: string,
	result?: {
		id: string,
		question: string,
		result: QuestionResult,
		type: string,
	}[],
	customData: {
		card: string,
		background: string,
		description: string,
	} & Record<string, string | number | boolean>,
	questions: Question[],
};
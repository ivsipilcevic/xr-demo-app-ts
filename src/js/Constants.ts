export const GLOBAL_NAMESPACE = 'xrsportdemo';

export const APP_VERSION = '2022-09-06.1';

declare global {
  interface Window {
    DEMO_APP_CONFIG: {
      BASE_PATH: string;
      AS_STACK_APP_ID: string;
      PLAYFAB_APP_ID: string;
      REALTIME_API_KEY: string;
      STACK_API: string;
      REALTIME_API: string;
      REALTIME_EVENT_SOURCE: string;
    };
  }
}

export const AS_STACK_APP_ID = window.DEMO_APP_CONFIG.AS_STACK_APP_ID;
export const PLAYFAB_APP_ID = window.DEMO_APP_CONFIG.PLAYFAB_APP_ID;
export const REALTIME_API_KEY = window.DEMO_APP_CONFIG.REALTIME_API_KEY;

export const DEFAULT_LANG = 'en';

// export const CDN_BASE = 'https://xrdatalakenab2022.blob.core.windows.net/react/';
export const CDN_BASE = '/';

export const DEFAULT_ERROR_MESSAGE = 'An error has occurred';

export const BASE_PATH = window.DEMO_APP_CONFIG.BASE_PATH;

export const ROUTES = {
  ROOT: '/',
  PROFILE: 'profile',
  LOGIN: 'login',
  MEDIA: 'media',
  MATCH: 'match',
  HIGHLIGHT_MATCH: 'highlight-match',
  STORE: 'store',
};

export const ENDPOINTS = {
  STACK_API: window.DEMO_APP_CONFIG.STACK_API,
  REALTIME_API: window.DEMO_APP_CONFIG.REALTIME_API,
  REALTIME_EVENT_SOURCE: window.DEMO_APP_CONFIG.REALTIME_EVENT_SOURCE,
};

export const EXCLUDED_LOGGER_ACTIONS = [];

export const POLL_RATES = {
  SEND_HEARTBEAT: 1000 * 60,
};

export const ITEM_CLASSES = {
  OVERRIDE: 'Override',
  TEAM: 'Team',
  BADGE: 'Badges',
  SHOP_PRODUCT: 'Shop Product',
};

export const MISSIONS_TYPES = {
  CHALLENGE: 'Challenge',
};

export enum QuestionTypes {
  Multiple = 'multiple',
  MultipleImage = 'multiple-image',
  Inputs = 'inputs',
}

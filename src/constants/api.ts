export const TRANSLATION_CONFIG = {
  TARGET_LANGUAGE: 'JA',
  REQUEST_METHOD: 'POST',
  CONTENT_TYPE: 'application/json',
} as const;

export const FOOTBALL_CONFIG = {
  ARSENAL_TEAM_ID: 57,
} as const;

export const {
    VITE_NEWS_RSS_ENDPOINT: endpoint,
    VITE_NEWS_API_KEY: apikey,
    VITE_NEWS_API_QUERY_Q: qInTitle,
    VITE_NEWS_API_QUERY_LANGUAGE: rawLang,
    VITE_NEWS_API_QUERY_CATEGORY: category,
  } = import.meta.env;
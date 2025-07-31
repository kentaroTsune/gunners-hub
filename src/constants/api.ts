export const API_ENDPOINTS = {
  FOOTBALL: '/api/football/teams',
  TRANSLATE: '/api/deepl/v2/translate',
} as const;

export const TRANSLATION_CONFIG = {
  TARGET_LANGUAGE: 'JA',
  REQUEST_METHOD: 'POST',
  CONTENT_TYPE: 'application/json',
} as const;

export const FOOTBALL_CONFIG = {
  ARSENAL_TEAM_ID: 57,
} as const;

export const {
    VITE_RSS_ENDPOINT: endpoint,
    VITE_API_KEY: apikey,
    VITE_API_QUERY_Q: qInTitle,
    VITE_API_QUERY_LANGUAGE: rawLang,
    VITE_API_QUERY_CATEGORY: category,
  } = import.meta.env;
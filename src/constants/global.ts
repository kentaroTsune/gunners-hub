export const APP_CONFIG = {
  NAME: 'Arsenal Fan Site',
  VERSION: '1.0.0',
  LOCALE: 'ja-JP',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PLAYER_DETAIL: '/player/:id',
  ARTICLE_DETAIL: '/article/:id',
} as const;
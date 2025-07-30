import type { PlayerStats } from '../types/player';

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  appearances: 0,
  goals: 0,
  assists: 0,
} as const;

export const LOGIN_REDIRECT_PATH = '/';

export const LOGIN_MESSAGES = {
  TITLE: 'ログイン',
  DESCRIPTION: 'Googleアカウントでログインしてください',
  BUTTON_LOGIN: 'Googleでログイン',
  BUTTON_LOADING: 'ログイン中...',
  ARIA_LABEL: 'Googleアカウントでログイン',
} as const;
// エラーメッセージの生成
export const createLoginErrorMessage = (error: unknown): string => {
  console.error(`ログインエラー: ${String(error)}`);
  return 'ログインに失敗しました。もう一度お試しください。';
};

// ログイン成功時のリダイレクト先
export const LOGIN_REDIRECT_PATH = '/';

// ログイン時のメッセージ
export const LOGIN_MESSAGES = {
  TITLE: 'ログイン',
  DESCRIPTION: 'Googleアカウントでログインしてください',
  BUTTON_LOGIN: 'Googleでログイン',
  BUTTON_LOADING: 'ログイン中...',
  ARIA_LABEL: 'Googleアカウントでログイン',
} as const;
// エラーメッセージの生成
export const createLoginErrorMessage = (error: unknown): string => {
  console.error(`ログインエラー: ${String(error)}`);
  return 'ログインに失敗しました。もう一度お試しください。';
};
export const DUMMY_IMAGE = '/src/assets/img/dummy.jpg';

// プレイヤー画像のalt属性テキストを生成
export const createPlayerImageAltText = (playerId?: string | null, name?: string): string => {
  if (!playerId) return 'プロフィール画像がありません';
  return `${name || '選手'}のプロフィール画像`;
};

// 画像読み込みエラー時のハンドラーを作成
export const createPlayerImageErrorHandler = () => {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== DUMMY_IMAGE) {
      img.src = DUMMY_IMAGE;
    }
  };
};
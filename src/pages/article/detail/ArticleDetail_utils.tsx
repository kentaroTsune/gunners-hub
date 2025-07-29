export const DUMMY_IMAGE = '/src/assets/img/dummy.jpg';

// 画像URLを取得
export const getSafeImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) return DUMMY_IMAGE;

  try {
    const url = new URL(imageUrl);
    return url.protocol === 'https:' ? imageUrl : DUMMY_IMAGE;
  } catch {
    return DUMMY_IMAGE;
  }
};

// 日付を日本語形式でフォーマット
export const formatArticleDate = (pubDate?: string): string => {
  if (!pubDate) return '';

  return new Date(pubDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 画像読み込みエラー時のハンドラー
export const createImageErrorHandler = () => {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== DUMMY_IMAGE) {
      img.src = DUMMY_IMAGE;
    }
  };
};
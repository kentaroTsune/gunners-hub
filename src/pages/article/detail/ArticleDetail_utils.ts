import { IMAGE_PATHS } from '../../../constants/ui';

// 画像URLを取得
export const getSafeImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) return IMAGE_PATHS.DUMMY_IMAGE;

  try {
    const url = new URL(imageUrl);
    return url.protocol === 'https:' ? imageUrl : IMAGE_PATHS.DUMMY_IMAGE;
  } catch {
    return IMAGE_PATHS.DUMMY_IMAGE;
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
    if (img.src !== IMAGE_PATHS.DUMMY_IMAGE) {
      img.src = IMAGE_PATHS.DUMMY_IMAGE;
    }
  };
};
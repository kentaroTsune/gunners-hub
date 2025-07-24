import { getPlayerImageUrlWithFallback } from '../../../utils/playerImage';

interface PlayerImageProps {
  playerId?: string | null;
  name?: string;
}

const DUMMY_IMAGE = '/src/assets/img/dummy.jpg';

export const PlayerImage = ({ playerId, name = '選手' }: PlayerImageProps) => {
  const imageUrl = playerId ? getPlayerImageUrlWithFallback(playerId) : DUMMY_IMAGE;
  const altText = playerId ? `${name}のプロフィール画像` : 'プロフィール画像がありません';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== DUMMY_IMAGE) {
      img.src = DUMMY_IMAGE;
    }
  }

  return (
    <figure className="w-full flex justify-center mb-8">
      <img
        src={imageUrl}
        alt={altText}
        className="w-200 object-cover"
        loading="lazy"
        onError={handleImageError}
      />
    </figure>
  )
}

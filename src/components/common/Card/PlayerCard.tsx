import { Link } from 'react-router-dom';
import { getPlayerImageUrlWithFallback } from '../../../utils/playerImage';
import type { Player } from '../../../types/player';
import { IMAGE_PATHS } from '../../../constants/ui';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== IMAGE_PATHS.DUMMY_IMAGE) {
      img.src = IMAGE_PATHS.DUMMY_IMAGE;
    }
  };

  return (
    <Link
      to={`/player/detail/${player.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:opacity-90 cursor-pointer transition-opacity"
      aria-label={`選手 ${player.name} の詳細ページへ`}
    >
      <figure>
        <img
          src={getPlayerImageUrlWithFallback(player.id)}
          alt={`${player.name}の写真`}
          className="w-full md:h-80 lg:h-50 object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      </figure>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">
            {player.position || 'ポジション未設定'}
          </span>
          <span className="text-sm text-gray-500">
            {player.nationality || '国籍未設定'}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">
          {player.name}
        </h3>
      </div>
    </Link>
  );
};

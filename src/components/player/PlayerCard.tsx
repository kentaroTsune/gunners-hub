import { Link } from 'react-router-dom';
import { getPlayerImageUrlWithFallback } from '../../utils/playerImage';
import type { Player } from '../../types/player';

export const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <Link to={`/players/${player.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:opacity-90 cursor-pointer transition-opacity">
      {/* 画像部分*/}
      <img
        src={getPlayerImageUrlWithFallback(player.id)}
        alt={player.name}
        className="w-full md:h-80 lg:h-50 object-cover"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          img.src = '/src/assets/img/dummy.jpg';
          img.onerror = null;
        }}
      />
      {/* コンテンツ部分 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">
            {player.position || 'Position not set'}
          </span>
          <span className="text-sm text-gray-500">
            {player.nationality || 'Nationality not set'}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">
          {player.name}
        </h3>
      </div>
    </Link>
  );
};

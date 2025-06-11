import type { Player } from '../../types/player';

export const PlayerCard = ({ player }: { player: Player }) => {
  // 選手画像取得
  const getPlayerImage = (playerId: string) => {
    try {
      // 選手IDで紐付け
      return `/src/assets/img/${playerId}.jpeg`
    } catch {
      return '/src/assets/img/dummy.jpg'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 画像部分*/}
      <img
        src={getPlayerImage(player.id)}
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
        </div>
        <h3 className="text-lg font-bold mb-2">
          {player.name}
        </h3>
      </div>
    </div>
  );
};

import { getPlayerImageUrlWithFallback } from '../../utils/playerImage';

interface PlayerImageProps {
  playerId: string | null;
  name?: string;
}

export const PlayerImage = ({ playerId, name }: PlayerImageProps) => {
  return (
    <div className="w-full flex justify-center mb-8">
      {playerId ?
        <img
          src={getPlayerImageUrlWithFallback(playerId)}
          alt={`${name}のプロフィール画像`}
          className="w-200 object-cover"
        />
        :
        <img
          src="/src/assets/img/dummy.jpg"
          alt="ダミー画像"
          className="w-200 object-cover"
        />
      }
      </div>
  )
}

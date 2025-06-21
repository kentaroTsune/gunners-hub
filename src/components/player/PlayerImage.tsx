import { getPlayerImageUrlWithFallback } from '../../utils/playerImage';

interface Props {
  playerId: string | null;
  name?: string;
}

export const PlayerImage = ({ playerId, name }: Props) => (
  <div className="w-full flex justify-center mb-8">
    <img
      src={getPlayerImageUrlWithFallback(playerId)}
      alt={`${name}のプロフィール画像`}
      className="w-200 object-cover"
    />
  </div>
)
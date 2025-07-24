import { usePlayers } from '../../hooks/usePlayers';
import { PlayerCard } from './PlayerCard';
import { NavigationButton } from '../common/NavigationButton';

export const PlayerList = () => {
  const { players, loading, error } = usePlayers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <NavigationButton text={'戻る'} />
      <h2 className="text-2xl mt-6 mb-6 font-bold text-gray-800">選手一覧</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </>
  );
}
import { usePlayers } from '../../hooks/usePlayers';
import { PlayerCard } from './PlayerCard';

export const PlayerList = () => {
  const { players, loading, error, refresh } = usePlayers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h2 className="text-2xl mb-6 font-bold text-gray-800">選手一覧</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </>
  );
}
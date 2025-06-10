import { usePlayers } from '../../hooks/usePlayers';
import { PlayerCard } from './PlayerCard';

export const PlayerList = () => {
  const { players, loading, error, refresh } = usePlayers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh Data</button>
      {players.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
}
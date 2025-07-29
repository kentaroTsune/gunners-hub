import { usePlayers } from './PlayerList_hooks';
import { PlayerCard } from '../../components/common/Card/PlayerCard';
import { NavigationButton } from '../../components/common/Button/NavigationButton';

export const PlayerList = () => {
  const { players, loading, error } = usePlayers();

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-1 min-h-64">
        <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
        <p className="text-gray-600">選手データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">エラー: {error}</p>
        <NavigationButton text="戻る" />
      </div>
    );
  }

  return (
    <>
      <NavigationButton text={'戻る'} />
      <h2 className="text-2xl mt-6 mb-6 font-bold text-gray-800">選手一覧({players.length}人)</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </>
  );
}
import { useParams } from 'react-router-dom';
import type { Players } from '../../types/player';
import { usePlayerDetail } from '../../hooks/usePlayerDetail';
import { useState } from 'react';

interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
}

export const PlayerDetail = () => {
  const { id } = useParams();
  const { player, loading, error } = usePlayerDetail(id || '');

  const renderContent = () => {
    const [stats, setStats] = useState<PlayerStats>({
      appearances: 0,
      goals: 0,
      assists: 0
    });

    switch (true) {
      case loading:
        return <div className="flex justify-center p-8">Loading...</div>;
      case !!error:
        return <div className="text-red-500 p-8">Error: {error.message}</div>;
      case !player:
        return <div className="p-8">Player not found</div>;
      default:
        return (
          <>
            {/* 基本情報 */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-full space-y-4">
                <h1 className="text-3xl font-bold">名前:{player.name}</h1>
                <div className="text-xl">
                  <span className="font-semibold">ポジション:</span> {player.position}
                </div>
                <div className="text-xl">
                  <span className="font-semibold">国籍:</span> {player.nationality}
                </div>
              </div>
            </div>
            {/* スタッツ */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Season Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* 出場試合数 */}
                <div className="border rounded p-4 text-center">
                  <div className="text-gray-500 text-sm">Appearances</div>
                  <div className="text-2xl font-bold">{stats.appearances}</div>
                </div>

                {/* ゴール数 */}
                <div className="border rounded p-4 text-center">
                  <div className="text-gray-500 text-sm">Goals</div>
                  <div className="text-2xl font-bold">{stats.goals}</div>
                </div>

                {/* アシスト数 */}
                <div className="border rounded p-4 text-center">
                  <div className="text-gray-500 text-sm">Assists</div>
                  <div className="text-2xl font-bold">{stats.assists}</div>
                </div>
              </div>
            </div>
          </>
        )
    }
  };

  return <div className="max-w-6xl mx-auto p-4 md:p-8">{renderContent()}</div>;
}

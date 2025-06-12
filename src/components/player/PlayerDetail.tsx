import { useParams } from 'react-router-dom';
import { usePlayerDetail } from '../../hooks/usePlayerDetail';
import { StatCard } from '../common/StatCard';
import { BioSection } from './BioSection';
import { PlayerInfoSection } from './PlayerInfoSection';

interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
}

export const PlayerDetail = () => {
  const { id } = useParams();
  const { player } = usePlayerDetail(id || '');
  // デフォルトのモックデータ
  const defaultStats: PlayerStats = {
    appearances: 0,
    goals: 0,
    assists: 0,
  };

  return (
    <>
      {/* 基本情報 */}
      <PlayerInfoSection name={player?.name} position={player?.position} nationality={player?.nationality} />
      {/* スタッツ */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">今シーズンのスタッツ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="出場試合数" value={player?.stats?.appearances ?? defaultStats.appearances} />
          <StatCard title="得点" value={player?.stats?.goals ?? defaultStats.goals} />
          <StatCard title="アシスト" value={player?.stats?.assists ?? defaultStats.assists} />
        </div>
      </div>
      {/* Bioセクション */}
      <BioSection bio={player?.bio} />
    </>
  );
}

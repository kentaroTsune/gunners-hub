import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { usePlayerDetail } from '../../../hooks/usePlayerDetail';
import { useAuthWithAdmin } from '../../../hooks/useAuthWithAdmin';
import { updatePlayerData } from '../../../utils/playerService';
import type { PlayerEditData, PlayerStats } from '../../../types/player';
import { StatCard } from '../../common/Card/StatCard';
import { NavigationButton } from '../../common/Button/NavigationButton';
import { PlayerBioSection } from './PlayerBioSection';
import { PlayerInfoSection } from './PlayerInfoSection';
import { PlayerImage } from './PlayerImage';

export const defaultStats: PlayerStats = {
  appearances: 0,
  goals: 0,
  assists: 0,
};

export const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { player } = usePlayerDetail(id || '');
  const { isAdmin } = useAuthWithAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    bio: '',
    stats: defaultStats
  });
  const [saving, setSaving] = useState(false);

  const initializeEditData = useMemo(() => {
    if (!player) return editData;

    return {
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      image: player.image || '',
      bio: player.bio || '',
      stats: player.stats || defaultStats
    }
  }, [player]);

  const handleEditStart = () => {
    if (!player) return;

    setEditData(initializeEditData);
    setIsEditing(true);
  }

  const handleEditCancel = () => {
    setEditData(initializeEditData);
    setIsEditing(false);
  }

  const handleEditDataChange = (field: keyof PlayerEditData, value: string) => {
    if (field === 'image') return;

    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handleStatsChange = (statField: keyof PlayerStats, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);

    setEditData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statField]: numValue
      }
    }));
  };

  const hasChanges = useMemo(() => {
    const original = initializeEditData;

    return (
      editData.name !== original.name ||
      editData.position !== original.position ||
      editData.nationality !== original.nationality ||
      editData.bio !== original.bio ||
      editData.stats.appearances !== original.stats.appearances ||
      editData.stats.goals !== original.stats.goals ||
      editData.stats.assists !== original.stats.assists
    );
  }, [editData, initializeEditData]);

  const handleSave = async () => {
    if (!player?.id) {
      alert("選手情報が取得できません")
      return;
    }

    if (!hasChanges) {
      alert("変更がありません");
      return;
    }

    try {
      setSaving(true);
      await updatePlayerData(player.id, editData);
      setIsEditing(false);
      alert("保存しました！");
      window.location.reload();
    } catch (error) {
      console.error(`選手データ更新エラー ${player.id}: ${String(error)}`);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <NavigationButton text={'戻る'} />
      </div>
      {/* 管理者のみ表示される編集機能 */}
      {isAdmin && (
        <div className="bg-red-300 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold">
              管理者モード
            </h3>
            {!isEditing ? (
              <button
                onClick={handleEditStart}
                className="px-3 py-2 rounded bg-white text-gray-800 hover:bg-gray-100"
                aria-label="選手情報の編集を開始"
              >
                編集開始
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    saving || !hasChanges
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                  aria-label="変更を保存"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  aria-label="編集をキャンセル"
                >
                  キャンセル
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 編集モード時入力フィールド */}
      {isEditing && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              選手名
            </label>
            <input
              id="name"
              type="text"
              value={editData.name}
              onChange={(e) => handleEditDataChange('name', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ポジション
            </label>
            <input
              id="position"
              type="text"
              value={editData.position}
              onChange={(e) => handleEditDataChange('position', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              国籍
            </label>
            <input
              id="nationality"
              type="text"
              value={editData.nationality}
              onChange={(e) => handleEditDataChange('nationality', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              選手紹介
            </label>
            <textarea
              id="bio"
              value={editData.bio}
              onChange={(e) => handleEditDataChange('bio', e.target.value)}
              disabled={saving}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              placeholder="選手の経歴やプロフィールを入力..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              今シーズンのスタッツ
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  試合出場数
                </label>
                <input
                  id="appearances"
                  type="number"
                  min="0"
                  value={editData.stats.appearances}
                  onChange={(e) => handleStatsChange('appearances', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  得点数
                </label>
                <input
                  id="goals"
                  type="number"
                  min="0"
                  value={editData.stats.goals}
                  onChange={(e) => handleStatsChange('goals', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  アシスト数
                </label>
                <input
                  id="assists"
                  type="number"
                  min="0"
                  value={editData.stats.assists}
                  onChange={(e) => handleStatsChange('assists', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 実際の表示フィールド */}
      {!isEditing && (
        <div className="space-y-8">
          <PlayerInfoSection
            name={player?.name}
            position={player?.position}
            nationality={player?.nationality}
          />
          <div className="flex justify-center">
            <PlayerImage
              playerId={player?.id}
              name={player?.name}
            />
          </div>
          <section aria-label="選手スタッツ">
            <h2 className="text-2xl font-bold mb-4">今シーズンのスタッツ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="出場試合数"
                value={player?.stats?.appearances ?? defaultStats.appearances}
              />
              <StatCard
                title="得点"
                value={player?.stats?.goals ?? defaultStats.goals}
              />
              <StatCard
                title="アシスト"
                value={player?.stats?.assists ?? defaultStats.assists}
              />
            </div>
          </section>
          <PlayerBioSection bio={player?.bio} />
        </div>
      )}
    </>
  );
}

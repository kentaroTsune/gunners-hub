import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePlayerDetail } from '../../hooks/usePlayerDetail';
import { useAuthWithAdmin } from '../../hooks/useAuthWithAdmin';
import { updatePlayerData } from '../../utils/playerService';
import type { PlayerEditData, PlayerStats } from '../../types/player';
import { StatCard } from '../common/StatCard';
import { DetailButton } from '../common/DetailButton';
import { BioSection } from './BioSection';
import { PlayerInfoSection } from './PlayerInfoSection';
import { PlayerImage } from './PlayerImage';

export const defaultStats: PlayerStats = {
  appearances: 0,
  goals: 0,
  assists: 0,
};

export const PlayerDetail = () => {
  const { id } = useParams();
  const { player } = usePlayerDetail(id || '');
  const { user, isAdmin, loading } = useAuthWithAdmin();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    bio: '',
    stats: defaultStats
  });
  const [originalData, setOriginalData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    image: '',
    bio: '',
    stats: defaultStats
  });
  const [saving, setSaving] = useState<boolean>(false);

  const handleEditStart = (): void => {
    if (!player) return;

    const editableData: PlayerEditData = {
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      image: player.image || '',
      bio: player.bio || '',
      stats: player.stats || defaultStats
    }

    setOriginalData(editableData);
    setEditData(editableData);
    setIsEditing(true);
  }

  const handleEditCancel = (): void => {
    setEditData(originalData);
    setIsEditing(false);
  }

  const handleEditDataChange = (field: keyof PlayerEditData, value: string): void => {
    if (field === 'image') return;

    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handleStatsChange = (statField: keyof PlayerStats, value: string): void => {
    const numValue = parseInt(value) || 0;

    setEditData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statField]: numValue
      }
    }));;
  };

  const handleSave = async (): Promise<void> => {
    if (!player?.id) {
      alert("選手情報が取得できません")
      return;
    }

    // 既存データから変更があるかチェック
    const hasChanges =
      editData.name !== originalData.name ||
      editData.position !== originalData.position ||
      editData.nationality !== originalData.nationality ||
      editData.bio !== originalData.bio ||
      editData.stats.appearances !== originalData.stats.appearances ||
      editData.stats.goals !== originalData.stats.goals ||
      editData.stats.assists !== originalData.stats.assists;

    if (!hasChanges) {
      alert("変更がありません");
      return;
    }

    try {
      setSaving(true);

      // Firestore更新
      await updatePlayerData(player.id, editData);

      setOriginalData(editData);
      setIsEditing(false);

      alert("保存しました！");
      window.location.reload();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* デバッグ */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: '#f0f0f0',
        width: '300px',
        padding: '10px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <p>ログイン: {user ? '済' : '未'}</p>
        <p>ユーザーUID: {user?.uid || 'なし'}</p>
        <p>メール: {user?.email || 'なし'}</p>
        <p>管理者: {isAdmin ? 'YES' : 'NO'}</p>
        <p>認証ローディング: {loading ? 'YES' : 'NO'}</p>
        <p>編集モード: {isEditing ? 'ON' : 'OFF'}</p>
        <p>保存中: {saving ? 'YES' : 'NO'}</p>
        {isEditing && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <p><strong>編集中データ:</strong></p>
            <p>名前: {editData.name}</p>
            <p>ポジション: {editData.position}</p>
            <p>国籍: {editData.nationality}</p>
            <p>選手紹介: {editData.bio ? `${editData.bio.substring(0, 15)}...` : '未入力'}</p>
            <p>出場: {editData.stats.appearances}</p>
            <p>ゴール: {editData.stats.goals}</p>
            <p>アシスト: {editData.stats.assists}</p>
          </div>
        )}
      </div>
      {/* 一覧ページに戻るボタン  */}
      <div className="mb-4">
        <DetailButton />
      </div>
      {/* 管理者のみ表示される編集コントロール */}
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
              >
                編集開始
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {saving ? "保存中..." : "保存" }
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 編集モード時の簡易テスト用入力フィールド */}
      {isEditing && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              選手名
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => handleEditDataChange('name', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ポジション
            </label>
            <input
              type="text"
              value={editData.position}
              onChange={(e) => handleEditDataChange('position', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              国籍
            </label>
            <input
              type="text"
              value={editData.nationality}
              onChange={(e) => handleEditDataChange('nationality', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              選手紹介
            </label>
            <textarea
              value={editData.bio}
              onChange={(e) => handleEditDataChange('bio', e.target.value)}
              disabled={saving}
              className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="number"
                  min="0"
                  value={editData.stats.appearances}
                  onChange={(e) => handleStatsChange('appearances', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  得点数
                </label>
                <input
                  type="number"
                  min="0"
                  value={editData.stats.goals}
                  onChange={(e) => handleStatsChange('goals', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  アシスト数
                </label>
                <input
                  type="number"
                  min="0"
                  value={editData.stats.assists}
                  onChange={(e) => handleStatsChange('assists', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 実際の表示フィールド */}
      {!isEditing && (
        <>
          {/* 基本情報 */}
          <PlayerInfoSection name={player?.name} position={player?.position} nationality={player?.nationality} />
          <PlayerImage playerId={player?.id} name={player?.name} className="w-32 h-32 rounded-full" />
          {/* スタッツ */}
          <div className="mb-8">
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
      )}
    </>
  );
}

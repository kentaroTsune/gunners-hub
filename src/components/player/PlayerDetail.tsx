import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePlayerDetail } from '../../hooks/usePlayerDetail';
import { useAuth } from '../../hooks/useAuth';
import type { PlayerEditData } from '../../types/player';
import { StatCard } from '../common/StatCard';
import { DetailButton } from '../common/DetailButton';
import { BioSection } from './BioSection';
import { PlayerInfoSection } from './PlayerInfoSection';
import { PlayerImage } from './PlayerImage';

interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
}

export const PlayerDetail = () => {
  const { id } = useParams();
  const { player } = usePlayerDetail(id || '');
  const { user, isAdmin, loading } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  // 編集中のデータ
  const [editData, setEditData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    image: '',
    bio: ''
  });
  // 編集前の元データ
  const [originalData, setOriginalData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    image: '',
    bio: ''
  });

  const handleEditStart = (): void => {
    if (!player) return;

    const editableData: PlayerEditData = {
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      image: player.image || '',
      bio: player.bio || '',
    }

    setOriginalData(editableData);
    setEditData(editableData);
    setIsEditing(true);

    // デバッグ
    // console.log("編集モード開始", editableData);
  }

  const handleEditCancel = (): void => {
    setEditData(originalData);
    setIsEditing(false);

    // デバッグ
    // console.log('編集をキャンセル', originalData);
  }

  const handleEditDataChange = (field: keyof PlayerEditData, value: string): void => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));

    // デバッグ
    // console.log(`${field}を更新:`, value);
  }

  const defaultStats: PlayerStats = {
    appearances: 0,
    goals: 0,
    assists: 0,
  };

  return (
    <>
      {/* デバッグ */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#f0f0f0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <p>ログイン: {user ? '済' : '未'}</p>
        <p>ユーザーUID: {user?.uid || 'なし'}</p>
        <p>メール: {user?.email || 'なし'}</p>
        <p>管理者: {isAdmin ? 'YES' : 'NO'}</p>
        <p>認証ローディング: {loading ? 'YES' : 'NO'}</p>
        <p>編集モード: {isEditing ? 'ON' : 'OFF'}</p>
        {isEditing && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <p><strong>編集中データ:</strong></p>
            <p>名前: {editData.name}</p>
            <p>ポジション: {editData.position}</p>
            <p>国籍: {editData.nationality}</p>
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
                  onClick={() => console.log('保存処理（未実装）')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  保存
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

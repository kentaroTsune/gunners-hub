import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuthWithAdmin } from '../../../hooks/useAuthWithAdmin';
import type { Player, PlayerEditData, PlayerStats } from '../../../types/player';
import { createEditDataFromPlayer, hasDataChanges, normalizeStatValue, showAlert } from './PlayerDetail_utils';
import { DEFAULT_PLAYER_STATS } from '../../../constants';
import { usePlayerDetailQuery } from '../../../hooks/queries/usePlayerDetailQuery';
import { usePlayerMutation } from '../../../hooks/mutations/usePlayerMutation';

interface UsePlayerDetailReturn {
  player: Player | null;
  loading: boolean;
  error: string | null;
}

const usePlayerDetail = (id: string): UsePlayerDetailReturn => {
  const { data: player, isLoading: loading, error } = usePlayerDetailQuery(id);

  return {
    player: player ?? null,
    loading,
    error: error ? `選手詳細取得エラー ${id}: ${String(error)}` : null,
  };
};

export const usePlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { player, loading, error } = usePlayerDetail(id || '');
  const { isAdmin } = useAuthWithAdmin();
  const playerMutation = usePlayerMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    bio: '',
    stats: DEFAULT_PLAYER_STATS
  });

  // 編集データの初期化
  const initializeEditData = useMemo(() =>
    createEditDataFromPlayer(player),
    [player]
  );

  // 変更検知
  const hasChanges = useMemo(() =>
    hasDataChanges(initializeEditData, editData),
    [editData, initializeEditData]
  );

  // 編集開始
  const handleEditStart = () => {
    if (!player) return;
    setEditData(initializeEditData);
    setIsEditing(true);
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    setEditData(initializeEditData);
    setIsEditing(false);
  };

  // 基本データの変更
  const handleEditDataChange = (field: keyof PlayerEditData, value: string) => {
    if (field === 'image') return;

    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // スタッツデータの変更
  const handleStatsChange = (statField: keyof PlayerStats, value: string) => {
    const numValue = normalizeStatValue(value);

    setEditData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statField]: numValue
      }
    }));
  };

  // 保存処理
  const handleSave = async () => {
    if (!player?.id) {
      showAlert.noPlayer();
      return;
    }

    if (!hasChanges) {
      showAlert.noChanges();
      return;
    }

    try {
      await playerMutation.mutateAsync({
        playerId: player.id,
        data: editData
      });

      setIsEditing(false);

      showAlert.saveSuccess();
    } catch (error) {
      console.error(`選手データ更新エラー ${player.id}: ${String(error)}`);
      showAlert.saveError();
    }
  };

  return {
    // 基本機能
    player,
    loading: loading || playerMutation.isPending,
    error,
    // 管理者・編集機能
    isAdmin,
    isEditing,
    editData,
    saving: playerMutation.isPending,
    hasChanges,
    handleEditStart,
    handleEditCancel,
    handleEditDataChange,
    handleStatsChange,
    handleSave
  };
};
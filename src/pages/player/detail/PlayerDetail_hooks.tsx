import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { fetchFirestorePlayer } from '../../../repositories/playerRepository';
import { useAuthWithAdmin } from '../../../hooks/useAuthWithAdmin';
import { updatePlayerData } from '../../../repositories/playerRepository';
import type { Player, PlayerEditData, PlayerStats } from '../../../types/player';
import { createEditDataFromPlayer, hasDataChanges, normalizeStatValue, showAlert } from './PlayerDetail_utils';
import { DEFAULT_PLAYER_STATS } from '../../../constants';

interface UsePlayerDetailReturn {
  player: Player | null;
  loading: boolean;
  error: string | null;
}

const usePlayerDetail = (id: string): UsePlayerDetailReturn => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setPlayer(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadPlayer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFirestorePlayer(id);
        setPlayer(data);
      } catch (error) {
        const errorMessage = `選手詳細取得エラー ${id}: ${String(error)}`;
        setError(errorMessage);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id]);

  return { player, loading, error };
};

export const usePlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { player, loading, error } = usePlayerDetail(id || '');
  const { isAdmin } = useAuthWithAdmin();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PlayerEditData>({
    name: '',
    position: '',
    nationality: '',
    bio: '',
    stats: DEFAULT_PLAYER_STATS
  });
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      await updatePlayerData(player.id, editData);
      setIsEditing(false);
      showAlert.saveSuccess();
      window.location.reload();
    } catch (error) {
      console.error(`選手データ更新エラー ${player.id}: ${String(error)}`);
      showAlert.saveError();
    } finally {
      setSaving(false);
    }
  };

  return {
    // 基本機能
    player,
    loading,
    error,
    // 管理者・編集機能
    isAdmin,
    isEditing,
    editData,
    saving,
    hasChanges,
    handleEditStart,
    handleEditCancel,
    handleEditDataChange,
    handleStatsChange,
    handleSave
  };
};
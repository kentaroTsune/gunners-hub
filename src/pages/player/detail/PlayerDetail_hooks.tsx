import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { usePlayerDetail } from '../../../hooks/usePlayerDetail';
import { useAuthWithAdmin } from '../../../hooks/useAuthWithAdmin';
import { updatePlayerData } from '../../../repositories/playerRepository';
import type { PlayerEditData, PlayerStats } from '../../../types/player';
import { defaultStats, createEditDataFromPlayer, hasDataChanges, normalizeStatValue, showAlert } from './PlayerDetail_utils';

export const usePlayerDetailPage = () => {
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
    player,
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
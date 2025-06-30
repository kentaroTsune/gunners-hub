import { doc, Timestamp, updateDoc } from "firebase/firestore";
import type { PlayerEditData } from "../types/player";
import { db } from "../firebase";


// 選手情報更新関数
export const updatePlayerData = async (playerId: string, updateData: Partial<PlayerEditData>): Promise<void> => {
  try {
    console.log('🔄 選手情報更新開始:', playerId, updateData);

    const playerRef = doc(db, 'players', playerId);

    // 更新データに現在時刻を追加
    const dataToUpdate = {
      ...updateData,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(playerRef, dataToUpdate);

    console.log('✅ 選手情報更新完了');
  } catch (error) {
    console.error('❌ 選手情報更新エラー:', error);
    throw error;
  }
};

export const extractEdittableFields = (editData: PlayerEditData): Partial<PlayerEditData> => {
  // imageフィールドのみ除外
  const { image, ...edittableFields } = editData;
  return edittableFields;
}
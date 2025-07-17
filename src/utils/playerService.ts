import { db } from "../firebase";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import type { PlayerEditData } from "../types/player";

export const updatePlayerData = async (playerId: string, updateData: Partial<PlayerEditData>): Promise<void> => {
  try {
    const playerRef = doc(db, 'players', playerId);
    const dataToUpdate = {
      ...updateData,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(playerRef, dataToUpdate);
  } catch (error) {
    throw new Error(`選手情報更新エラー ID${playerId}: ${String(error)}`);
  }
};

export const extractEditableFields = (editData: PlayerEditData): Partial<PlayerEditData> => {
  const { image, ...editableFields } = editData;

  return editableFields;
}
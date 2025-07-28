import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Player, PlayerEditData } from '../types/player';

export const fetchFirestorePlayer = async (id: string): Promise<Player | null> => {
  try {
    const docRef = doc(db, 'players', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Player;
  } catch (error) {
    throw new Error(`選手詳細取得エラー ${id}: ${String(error)}`);
  }
};

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
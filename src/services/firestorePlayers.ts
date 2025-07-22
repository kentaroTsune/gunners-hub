import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Player } from '../types/player';

export const fetchFirestorePlayers = async (): Promise<Player[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'players'));

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Player[];
  } catch (error) {
    throw new Error(`選手データ取得エラー: ${String(error)}`);
  }
};

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
}


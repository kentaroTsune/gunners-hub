import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Player } from '../types/player';

/**
 * Firestoreから全選手データを取得
 */
export const fetchFirestorePlayers = async (): Promise<Player[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'players'));

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Player[];
  } catch (error) {
    console.error("選手データの取得に失敗しました。", error);
    throw new Error("選手データの取得に失敗しました");
  }
};

/**
 * Firestoreから特定選手のデータを取得
 * @param id 選手ID
 */
export const fetchFirestorePlayer = async (id: string): Promise<Player | null> => {
  try {
    const docRef = doc(db, 'players', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`選手ID${id}のデータが見つかりません`);
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Player;
  } catch (error) {
    console.error(`選手ID ${id} の取得に失敗しました:`, error);
    throw new Error('選手詳細の取得に失敗しました');
  }
}


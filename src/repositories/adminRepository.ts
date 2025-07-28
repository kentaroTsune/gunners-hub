import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const checkUserIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists();
  } catch (error) {
    throw new Error(`管理者権限確認エラー ${uid}: ${String(error)}`);
  }
};
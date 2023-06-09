import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from './firebase-config';

export default async function getAccount(userId) {
  const accountDoc = await getDocs(
    query(
      collection(getFirestore(app), 'accounts'),
      where('userId', '==', userId)
    )
  );
  console.log('get accounts for getAccount');
  return accountDoc.docs[0];
}

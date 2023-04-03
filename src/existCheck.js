import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from './firebase-config';

export default async function existCheck(userId) {
  const accountQuery = query(
    collection(getFirestore(app), 'accounts'),
    where('userId', '==', `${userId}`)
  );

  const info = await getDocs(accountQuery);

  return info.docs;
}

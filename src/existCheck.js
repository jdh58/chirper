import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from './firebase-config';

export default async function existCheck(id) {
  const accountQuery = query(
    collection(getFirestore(app), 'accounts'),
    where('id', '==', `${id}`)
  );

  const info = await getDocs(accountQuery);
  console.log(info.docs);

  return info.docs;
}

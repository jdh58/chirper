import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from './firebase-config';

export default async function getChirp(chirpId) {
  const chirpDoc = await getDocs(
    query(
      collection(getFirestore(app), 'chirps'),
      where('chirpId', '==', chirpId)
    )
  );
  console.log('get chirp for getChirp');

  return chirpDoc.docs[0];
}

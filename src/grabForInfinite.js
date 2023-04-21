import { getDocs } from 'firebase/firestore';
import Chirp from './components/Chirp';

export default async function grabForInfinite(query) {
  try {
    const docs = await getDocs(query);
    console.log('fetched for grabForInfinite');

    const chirpsArray = [];

    docs.docs.forEach((chirpDoc) => {
      const chirpData = chirpDoc.data();

      chirpsArray.push(<Chirp chirpData={chirpData} key={chirpData.chirpId} />);
    });

    return {
      finalChirp: docs.docs[docs.docs.length - 1],
      newChirps: chirpsArray,
    };
  } catch (error) {
    console.error('Could not fetch following chirps', error);
  }
}

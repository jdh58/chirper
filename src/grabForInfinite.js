import { getDocs } from 'firebase/firestore';
import Chirp from './components/Chirp';
import { v4 as uuidv4 } from 'uuid';

export default async function grabForInfinite(query) {
  try {
    const docs = await getDocs(query);
    console.log('fetched for grabForInfinite');

    const chirpsArray = [];

    docs.docs.forEach((chirpDoc) => {
      const chirpData = chirpDoc.data();

      chirpsArray.push(<Chirp chirpData={chirpData} key={uuidv4()} />);
    });

    return {
      finalChirp: docs.docs[docs.docs.length - 1],
      newChirps: chirpsArray,
    };
  } catch (error) {
    console.error('Could not fetch chirps', error);
  }
}

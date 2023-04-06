import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import Delete from '../assets/delete.svg';
import Bookmark from '../assets/bookmark.svg';
import '../styles/MoreMenu.css';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { app } from '../firebase-config';

export default function MoreMenu({ chirpData, killMenu }) {
  const [isUsers, setIsUsers] = useState(false);

  const user = useContext(UserContext) || {
    userId: '',
  };

  // Detect if the chirp is the user's, so we know if we show delete
  useEffect(() => {
    if (user.userId === chirpData.accountId) {
      setIsUsers(true);
    }
  }, []);

  const handleDelete = async () => {
    try {
      killMenu();
      const chirpToDelete = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('chirpId', '==', chirpData.chirpId)
        )
      );

      console.log(chirpToDelete.docs[0].data());

      await deleteDoc(chirpToDelete.docs[0].ref);

      // Lower chirp count by 1

      // Display toast notification, refactor it to context over prop
    } catch (error) {
      console.error('Failed to delete Chirp', error);
    }
  };

  return (
    <div className={isUsers ? 'moreMenu users' : 'moreMenu'}>
      {isUsers ? (
        <div className="delete option" onClick={handleDelete}>
          <img src={Delete} alt="" />
          <p>Delete</p>
        </div>
      ) : null}
      <div className="bookmark option">
        <img src={Bookmark} alt="" />
        <p>Bookmark</p>
      </div>
    </div>
  );
}

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
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import getChirp from '../getChirp';
import getAccount from '../getAccount';
import ToastContext from '../ToastContext';

export default function MoreMenu({ chirpData, killMenu }) {
  const [isUsers, setIsUsers] = useState(false);
  const user = useContext(UserContext) || {
    userId: '',
  };
  const displayToast = useContext(ToastContext);

  // Detect if the chirp is the user's, so we know if we show delete
  useEffect(() => {
    if (user.userId === chirpData.accountId) {
      setIsUsers(true);
    }
  }, []);

  const handleDelete = async () => {
    try {
      killMenu();
      const userDoc = await getAccount(user.userId);
      const chirpToDelete = await getChirp(chirpData.chirpId);

      await deleteDoc(chirpToDelete.ref);

      // Lower chirp count by 1... o
      const currentChirps = userDoc.data().chirps;
      await updateDoc(userDoc.ref, {
        chirps: currentChirps - 1,
      });

      // Display toast notification
      displayToast('Your Chirp was deleted');
    } catch (error) {
      console.error('Failed to delete Chirp', error);
    }
  };

  const handleBookmark = async () => {
    try {
      killMenu();
      const chirpToBookmark = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('chirpId', '==', chirpData.chirpId)
        )
      );

      const chirpToBookmarkData = chirpToBookmark.docs[0].data();

      const accountToAddBookmark = await getDocs(
        query(
          collection(getFirestore(app), 'accounts'),
          where('userId', '==', `${chirpData.accountId}`)
        )
      );

      await updateDoc(accountToAddBookmark.docs[0].ref, {
        bookmarks: arrayUnion(chirpToBookmarkData),
      });

      // Display toast notification here
    } catch (error) {
      console.error('Failed to bookmark Chirp.', error);
    }
  };

  return (
    <>
      <div className={isUsers ? 'moreMenu users' : 'moreMenu'}>
        {isUsers ? (
          <div className="delete option" onClick={handleDelete}>
            <img src={Delete} alt="" />
            <p>Delete</p>
          </div>
        ) : null}
        <div className="bookmark option" onClick={handleBookmark}>
          <img src={Bookmark} alt="" />
          <p>Bookmark</p>
        </div>
      </div>
    </>
  );
}

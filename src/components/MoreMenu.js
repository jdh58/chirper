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
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    // Check if this is the user's own chirp
    if (user.userId === chirpData.accountId) {
      setIsUsers(true);
    }

    // Set the user document from the user context.
    (async () => {
      if (user.userId) {
        setUserDoc(await getAccount(user.userId));
      }
    })();
  }, []);

  const handleDelete = async () => {
    try {
      killMenu();
      const chirpToDelete = await getChirp(chirpData.chirpId);

      await deleteDoc(chirpToDelete.ref);

      // Lower chirp count by 1
      const currentChirps = userDoc.data().chirps;
      await updateDoc(userDoc.ref, {
        chirps: currentChirps - 1,
      });

      displayToast('Your Chirp was deleted');
    } catch (error) {
      displayToast('Failed to delete Chirp.');
      console.error('Failed to delete Chirp', error);
    }
  };

  const handleBookmark = async () => {
    try {
      killMenu();
      const chirpToBookmark = await getChirp(chirpData.chirpId);

      await updateDoc(userDoc.ref, {
        bookmarks: arrayUnion(chirpToBookmark.data().chirpId),
      });

      displayToast('Your Chirp was bookmarked');
    } catch (error) {
      displayToast('Failed to bookmark Chirp.');
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

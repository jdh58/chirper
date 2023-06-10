import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import Delete from '../assets/delete.svg';
import Bookmark from '../assets/bookmark.svg';
import BookmarkFill from '../assets/bookmark_fill.svg';
import '../styles/MoreMenu.css';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  or,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import getChirp from '../getChirp';
import getAccount from '../getAccount';
import ToastContext from '../ToastContext';

export default function MoreMenu({ chirpData, killMenu }) {
  const [isUsers, setIsUsers] = useState(false);
  const [alreadyBookmarked, setAlreadyBookmarked] = useState(false);
  const user = useContext(UserContext);
  const displayToast = useContext(ToastContext);
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    // Check if this is the user's own chirp
    if (user.userId === chirpData.accountId) {
      setIsUsers(true);
    }

    // Check if the user already has it bookmarked
    if (user.bookmarks.includes(chirpData.chirpId)) {
      setAlreadyBookmarked(true);
    }

    // Set the user document from the user context.
    (async () => {
      if (user.userId) {
        setUserDoc(await getAccount(user.userId));
      }
    })();
  }, [user, chirpData]);

  const handleDelete = async () => {
    try {
      killMenu();
      const chirpToDelete = await getChirp(chirpData.chirpId);
      const deletedChirpData = chirpToDelete.data();

      await deleteDoc(chirpToDelete.ref);

      // If the deleted chirp is a reply, remove it from that chirp's replies array
      if (deletedChirpData.isReply) {
        const repliedToChirp = await getChirp(
          parseInt(deletedChirpData.replyTo)
        );

        await updateDoc(repliedToChirp.ref, {
          replies: arrayRemove(deletedChirpData.chirpId),
        });
      }

      // Find any user where they have liked, rechirped, or bookmarked this chirp and remove it
      const impactedAccounts = await getDocs(
        collection(getFirestore(app), 'accounts'),
        query(
          or(
            where('likes', 'array-contains', `${deletedChirpData.chirpId}`),
            where('reChirps', 'array-contains', `${deletedChirpData.chirpId}`),
            where('bookmarks', 'array-contains', `${deletedChirpData.chirpId}`)
          )
        )
      );

      impactedAccounts.forEach(async (accountDoc) => {
        try {
          await updateDoc(accountDoc.ref, {
            likes: arrayRemove(deletedChirpData.chirpId),
            reChirps: arrayRemove(deletedChirpData.chirpId),
            bookmarks: arrayRemove(deletedChirpData.chirpId),
          });
        } catch (err) {
          console.error(err);
        }
      });

      // Lower chirp count by 1
      const currentChirps = userDoc.data().chirps;
      await updateDoc(userDoc.ref, {
        chirps: currentChirps - 1,
      });

      // If the user had any hashtags, update the database.
      const hashRegex = /#[a-zA-Z0-9]+/g;
      const hashArray = [];
      let hashMatch;

      while ((hashMatch = hashRegex.exec(chirpData.text)) !== null) {
        hashArray.push(hashMatch[0]);
      }

      if (hashArray.length > 0) {
        // Subtract one from each hashtag's count
        hashArray.forEach(async (hashtag) => {
          const hashtagDoc = await getDocs(
            query(
              collection(getFirestore(app), 'hashtags'),
              where('name', '==', `${hashtag}`)
            )
          );
          console.log('get hashtag for handleDelete');

          const hashtagCount = hashtagDoc.docs[0].data().count;
          const hashtagRef = hashtagDoc.docs[0].ref;

          /* If the hashtag has never been sent before, add a doc 
                  for it with initial count of 1. */
          await updateDoc(hashtagRef, {
            count: hashtagCount - 1,
          });
        });
      }

      displayToast('Your Chirp was deleted');
    } catch (error) {
      displayToast('Failed to delete Chirp.');
      console.error('Failed to delete Chirp', error);
    }
  };

  const handleBookmark = async () => {
    try {
      killMenu();
      if (alreadyBookmarked) {
        await updateDoc(userDoc.ref, {
          bookmarks: arrayRemove(chirpData.chirpId),
        });
        displayToast('Removed bookmark.');
      } else {
        await updateDoc(userDoc.ref, {
          bookmarks: arrayUnion(chirpData.chirpId),
        });
        displayToast('Bookmarked Chirp.');
      }
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
          <img src={alreadyBookmarked ? BookmarkFill : Bookmark} alt="" />
          <p>{alreadyBookmarked ? 'Remove Bookmark' : 'Bookmark'}</p>
        </div>
      </div>
    </>
  );
}

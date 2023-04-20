import { click } from '@testing-library/user-event/dist/click';
import {
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { app } from '../firebase-config';
import getAccount from '../getAccount';
import UserContext from '../UserContext';

export default function FollowButton({ clickedUser, isProfile }) {
  const loggedInUser = useContext(UserContext) || {
    following: '',
  };
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    for (let i = 0; i < loggedInUser.following.length; i++) {
      if (loggedInUser.following[i] === clickedUser.userId) {
        setIsFollowing(true);
        return;
      }
    }
  }, [loggedInUser, clickedUser]);

  const handleFollow = async () => {
    // Change state so button updates
    setIsFollowing(true);

    const loggedInUserDoc = getAccount(loggedInUser.userId);
    const clickedUserDoc = getAccount(clickedUser.userId);

    // Update logged in user's following
    await updateDoc(loggedInUserDoc.ref, {
      following: arrayUnion(clickedUser.userId),
    });

    // Update clicked user's followers
    await updateDoc(clickedUserDoc.ref, {
      followers: arrayUnion(loggedInUser.userId),
    });
  };

  const handleUnfollow = async () => {
    // Update state so button updates
    setIsFollowing(false);

    const loggedInUserDoc = getAccount(loggedInUser.userId);
    const clickedUserDoc = getAccount(clickedUser.userId);

    // Update logged in user's following
    await updateDoc(loggedInUserDoc.ref, {
      following: arrayRemove(clickedUser.userId),
    });

    // Update clicked user's followers
    await updateDoc(clickedUserDoc.ref, {
      followers: arrayRemove(loggedInUser.userId),
    });
  };

  return (
    <>
      {isFollowing ? (
        <button
          className={
            isProfile ? 'unfollowButton profileButton' : 'unfollowButton'
          }
          onClick={handleUnfollow}
        >
          Unfollow
        </button>
      ) : (
        <button
          className={isProfile ? 'followButton profileButton' : 'followButton'}
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
    </>
  );
}

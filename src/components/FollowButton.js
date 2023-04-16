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
  const [loggedInUserDoc, setLoggedInUserDoc] = useState(null);
  const [clickedUserDoc, setClickedUserDoc] = useState(null);

  useEffect(() => {
    if (loggedInUser.userId) {
      (async () => {
        setLoggedInUserDoc(await getAccount(loggedInUser.userId));
      })();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (clickedUser.userId) {
      (async () => {
        setClickedUserDoc(await getAccount(clickedUser.userId));
      })();
    }
  }, [clickedUser]);

  useEffect(() => {
    for (let i = 0; i < loggedInUser.following.length; i++) {
      if (loggedInUser.following[i]) {
        setIsFollowing(true);
        return;
      }
    }
  }, [loggedInUser]);

  const handleFollow = async () => {
    // Change state so button updates
    setIsFollowing(true);

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
        <div
          className={
            isProfile ? 'unfollowButton profileButton' : 'unfollowButton'
          }
          onClick={handleUnfollow}
        >
          Unfollow
        </div>
      ) : (
        <div
          className={isProfile ? 'followButton profileButton' : 'followButton'}
          onClick={handleFollow}
        >
          Follow
        </div>
      )}
    </>
  );
}

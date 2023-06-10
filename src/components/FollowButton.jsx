import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import getAccount from '../getAccount';
import UserContext from '../UserContext';

export default function FollowButton({ clickedUser, isProfile }) {
  const loggedInUser = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(false);
    if (!loggedInUser) {
      return;
    }

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

    const loggedInUserDoc = await getAccount(loggedInUser.userId);
    const clickedUserDoc = await getAccount(clickedUser.userId);

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

    const loggedInUserDoc = await getAccount(loggedInUser.userId);
    const clickedUserDoc = await getAccount(clickedUser.userId);

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

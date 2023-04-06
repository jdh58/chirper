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
import UserContext from '../UserContext';

export default function FollowButton({ profile, isProfile }) {
  const user = useContext(UserContext) || {
    following: '',
  };
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    for (let i = 0; i < user.following.length; i++) {
      if (user.following[i].userId) {
        setIsFollowing(true);
        return;
      }
    }
  }, [user]);

  const handleFollow = async () => {
    setIsFollowing(true);

    const userDoc = await getDocs(
      query(
        collection(getFirestore(app), 'accounts'),
        where('userId', '==', `${user.userId}`)
      )
    );

    await updateDoc(userDoc.docs[0].ref, {
      following: arrayUnion(profile),
    });
  };

  const handleUnfollow = async () => {
    setIsFollowing(false);

    const userDoc = await getDocs(
      query(
        collection(getFirestore(app), 'accounts'),
        where('userId', '==', `${user.userId}`)
      )
    );

    const userData = userDoc.docs[0].data();
    let removeObject;

    for (let i = 0; i < userData.following.length; i++) {
      console.log(userData.following[i].userId);
      if (userData.following[i].userId === profile.userId) {
        console.log('banana');
        removeObject = userData.following[i];
      }
    }

    await updateDoc(userDoc.docs[0].ref, {
      following: arrayRemove(removeObject),
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

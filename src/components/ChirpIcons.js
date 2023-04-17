import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import getAccount from '../getAccount';
import getChirp from '../getChirp';
import UserContext from '../UserContext';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import LikeFill from '../assets/likeFill.svg';
import Share from '../assets/share.svg';

export default function ChirpIcons({ chirpData, fullPage }) {
  const user = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [chirpLikes, setChirpLikes] = useState(chirpData.likes.length);

  useEffect(() => {
    // Check if the user has it liked, if not, like it, if they do, unlike it
    for (let i = 0; i < user.likes.length; i++) {
      if (user.likes[i] === chirpData.chirpId) {
        setIsLiked(true);
        return;
      }
    }
  }, [user, chirpData]);

  const handleLikeToggle = async () => {
    try {
      // Pre-emptively set isLiked state and update number for responsive UI
      if (isLiked) {
        setIsLiked(false);
        setChirpLikes(chirpLikes - 1);
      } else {
        setIsLiked(true);
        setChirpLikes(chirpLikes + 1);
      }

      // Update the chirp's likes and current user's likes
      const chirpDoc = await getChirp(chirpData.chirpId);
      const userDoc = await getAccount(user.userId);

      // Check if the user has it liked, if not, like it, if they do, unlike it
      if (isLiked) {
        updateDoc(chirpDoc.ref, {
          likes: arrayRemove(user.userId),
        });
        updateDoc(userDoc.ref, {
          likes: arrayRemove(chirpData.chirpId),
        });
      } else {
        updateDoc(chirpDoc.ref, {
          likes: arrayUnion(user.userId),
        });
        updateDoc(userDoc.ref, {
          likes: arrayUnion(chirpData.chirpId),
        });
      }
    } catch (error) {
      console.log('Failed to like chirp.' + error);
    }
  };

  return (
    <>
      {fullPage ? (
        <>
          <div className="chirpStats">
            <div className="replyCount countContainer">
              <p className="count">{chirpData.replies}</p>
              <p className="label">
                {chirpData.replies === 1 ? 'Reply' : 'Replies'}
              </p>
            </div>
            <div className="reChirpCount countContainer">
              <p className="count">{chirpData.reChirps}</p>
              <p className="label">
                {chirpData.reChirps === 1 ? 'ReChirp' : 'ReChirps'}
              </p>
            </div>
            <div className="likesCount countContainer">
              <p className="count">{chirpLikes}</p>
              <p className="label">{chirpLikes === 1 ? 'Like' : 'Likes'}</p>
            </div>
          </div>
          <div className="chirpIcons">
            <div className="icon chat">
              <div className="container">
                <img src={Chat} alt="" />
              </div>
            </div>
            <div className="icon reChirp">
              <div className="container">
                <img src={ReChirp} alt="" />
              </div>
            </div>
            <div className="icon likes">
              <div className="container" onClick={handleLikeToggle}>
                {isLiked ? (
                  <img src={LikeFill} alt="" className="fill" />
                ) : (
                  <img src={Like} alt="" />
                )}
              </div>
            </div>
            <div className="icon share">
              <div className="container">
                <img src={Share} alt="" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="chirpIcons">
          <div className="icon chat">
            <div className="container">
              <img src={Chat} alt="" />
            </div>
            <p className="count">
              {chirpData.replies > 0 ? chirpData.replies : null}
            </p>
          </div>
          <div className="icon reChirp">
            <div className="container">
              <img src={ReChirp} alt="" />
            </div>
            <p className="count">
              {chirpData.reChirps > 0 ? chirpData.reChirps : null}
            </p>
          </div>
          <div className="icon likes">
            <div className="container" onClick={handleLikeToggle}>
              {isLiked ? (
                <img src={LikeFill} alt="" className="fill" />
              ) : (
                <img src={Like} alt="" />
              )}
            </div>
            <p className="count">{chirpLikes > 0 ? chirpLikes : null}</p>
          </div>
          <div className="icon share">
            <div className="container">
              <img src={Share} alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

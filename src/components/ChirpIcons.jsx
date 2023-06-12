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
import { useParams } from 'react-router-dom';
import OverlayContext from '../OverlayContext';
import ToastContext from '../ToastContext';

export default function ChirpIcons({ chirpData, fullPage }) {
  const user = useContext(UserContext);
  const urlId = useParams().id;
  const overlayFunction = useContext(OverlayContext);
  const [isLiked, setIsLiked] = useState(false);
  const [chirpLikes, setChirpLikes] = useState(chirpData.likes.length);
  const [isReChirped, setIsReChirped] = useState(false);
  const [chirpReChirps, setChirpReChirps] = useState(chirpData.reChirps.length);
  const displayToast = useContext(ToastContext);

  useEffect(() => {
    if (user) {
      // Check if the user has it liked, if not, like it, if they do, unlike it
      if (user.likes.includes(chirpData.chirpId)) {
        setIsLiked(true);
      }
      if (user.reChirps.includes(chirpData.chirpId)) {
        setIsReChirped(true);
      }
    }
  }, [urlId, chirpData, user]);

  useEffect(() => {
    setChirpLikes(chirpData.likes.length);
    setChirpReChirps(chirpData.reChirps.length);
  }, [chirpData]);

  const handleLikeToggle = async () => {
    try {
      if (!user) {
        return;
      }

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
          likeCount: chirpDoc.data().likeCount - 1,
        });
        updateDoc(userDoc.ref, {
          likes: arrayRemove(chirpData.chirpId),
        });
      } else {
        updateDoc(chirpDoc.ref, {
          likes: arrayUnion(user.userId),
          likeCount: chirpDoc.data().likeCount + 1,
        });
        updateDoc(userDoc.ref, {
          likes: arrayUnion(chirpData.chirpId),
        });
      }
    } catch (error) {
      console.log('Failed to like chirp.' + error);
    }
  };

  const handleReChirpToggle = async () => {
    try {
      if (!user) {
        return;
      }

      // Pre-emptively set isReChirped state and update number for responsive UI
      if (isReChirped) {
        setIsReChirped(false);
        setChirpReChirps(chirpReChirps - 1);
      } else {
        setIsReChirped(true);
        setChirpReChirps(chirpReChirps + 1);
      }

      // Update the chirp's likes and current user's likes
      const chirpDoc = await getChirp(chirpData.chirpId);
      const userDoc = await getAccount(user.userId);

      // Check if the user has it reChirps, if not, reChirp it, if they do, un-reChirp it
      if (isReChirped) {
        await updateDoc(chirpDoc.ref, {
          reChirps: arrayRemove(user.userId),
        });
        await updateDoc(userDoc.ref, {
          reChirps: arrayRemove(chirpData.chirpId),
        });
      } else {
        await updateDoc(chirpDoc.ref, {
          reChirps: arrayUnion(user.userId),
        });
        await updateDoc(userDoc.ref, {
          reChirps: arrayUnion(chirpData.chirpId),
        });
      }
    } catch (error) {
      console.log('Failed to reChirp chirp.' + error);
    }
  };

  const handleShare = () => {
    displayToast('Chirp link copied to clipboard');
    navigator.clipboard.writeText(
      `https://chirper.jonathanhawes.dev/chirp/${chirpData.chirpId}`
    );
  };

  return (
    <>
      {fullPage ? (
        <>
          <div className="chirpStats" data-testid="chirp-stats">
            <div className="replyCount countContainer">
              <p className="count">{chirpData.replies.length}</p>
              <p className="label">
                {chirpData.replies.length === 1 ? 'Reply' : 'Replies'}
              </p>
            </div>
            <div className="reChirpCount countContainer">
              <p className="count" data-testid="rechirp-count">
                {chirpReChirps}
              </p>
              <p className="label">
                {chirpReChirps === 1 ? 'ReChirp' : 'ReChirps'}
              </p>
            </div>
            <div className="likesCount countContainer">
              <p className="count" data-testid="like-count">
                {chirpLikes}
              </p>
              <p className="label">{chirpLikes === 1 ? 'Like' : 'Likes'}</p>
            </div>
          </div>
          <div className="chirpIcons">
            <div
              className="icon chat"
              onClick={() => {
                overlayFunction('reply', chirpData.chirpId);
              }}
            >
              <div className="container">
                <img src={Chat} alt="" />
              </div>
            </div>
            <div className="icon reChirp">
              <div
                className="container"
                onClick={handleReChirpToggle}
                data-testid="rechirp-button"
              >
                <img
                  src={ReChirp}
                  alt="ReChirp Icon"
                  className={isReChirped ? 'fill' : ''}
                  data-testid="rechirp-icon"
                />
              </div>
            </div>
            <div className="icon likes">
              <div
                className="container"
                onClick={handleLikeToggle}
                data-testid="like-button"
              >
                {isLiked ? (
                  <img
                    src={LikeFill}
                    alt=""
                    className="fill"
                    data-testid="like-icon"
                  />
                ) : (
                  <img src={Like} alt="" data-testid="like-icon" />
                )}
              </div>
            </div>
            <div className="icon share">
              <div
                className="container"
                onClick={handleShare}
                data-testid="share-button"
              >
                <img src={Share} alt="" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="chirpIcons" data-testid="chirp-icons">
          <div
            className="icon chat"
            onClick={() => {
              overlayFunction('reply', chirpData.chirpId);
            }}
          >
            <div className="container">
              <img src={Chat} alt="" />
            </div>
            <p className="count">
              {chirpData.replies.length > 0 ? chirpData.replies.length : null}
            </p>
          </div>
          <div className="icon reChirp">
            <div
              className="container"
              onClick={handleReChirpToggle}
              data-testid="rechirp-button"
            >
              <img
                src={ReChirp}
                alt="ReChirp Icon"
                className={isReChirped ? 'fill' : ''}
                data-testid="rechirp-icon"
              />
            </div>
            <p className="count" data-testid="rechirp-count">
              {chirpReChirps > 0 ? chirpReChirps : null}
            </p>
          </div>
          <div className="icon likes">
            <div
              className="container"
              onClick={handleLikeToggle}
              data-testid="like-button"
            >
              {isLiked ? (
                <img
                  src={LikeFill}
                  alt=""
                  className={isLiked ? 'fill' : ''}
                  data-testid="like-icon"
                />
              ) : (
                <img src={Like} alt="" data-testid="like-icon" />
              )}
            </div>
            <p className="count" data-testid="like-count">
              {chirpLikes > 0 ? chirpLikes : null}
            </p>
          </div>
          <div className="icon share">
            <div
              className="container"
              onClick={handleShare}
              data-testid="share-button"
            >
              <img src={Share} alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

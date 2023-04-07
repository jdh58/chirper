import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import LikeFill from '../assets/likeFill.svg';
import Share from '../assets/share.svg';
import '../styles/ProfilePic.css';
import '../styles/Chirp.css';
import { createElement, useContext, useEffect, useState } from 'react';
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
import { app } from '../firebase-config';
import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import MoreMenu from './MoreMenu';
import { click } from '@testing-library/user-event/dist/click';
import getChirp from '../getChirp';
import UserContext from '../UserContext';
import getAccount from '../getAccount';
import ToastNotification from './ToastNotification';

export default function Chirp({ chirpData, profile }) {
  const navigate = useNavigate();
  const [displayMore, setDisplayMore] = useState(false);
  const user = useContext(UserContext) || {
    likes: '',
  };
  const [account, setAccount] = useState({
    name: null,
    username: null,
    image: null,
  });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (profile) {
      setAccount(profile);
    } else {
      (async () => {
        const accountDocs = await getAccount(chirpData.accountId);

        setAccount(accountDocs.data());
      })();
    }
  }, []);

  useEffect(() => {
    // Check if the user has it liked, if not, like it, if they do, unlike it
    for (let i = 0; i < user.likes.length; i++) {
      if (user.likes[i].chirpId === chirpData.chirpId) {
        setIsLiked(true);
        return;
      }
    }
  }, [user, profile]);

  function formatDistanceShort() {
    const distance = formatDistanceToNowStrict(parseISO(chirpData.postTime), {
      about: false,
    });
    const [value, unit] = distance.split(' ');
    switch (unit) {
      case 'seconds':
      case 'second':
        return 'now';
      case 'minutes':
      case 'minute':
        return `${value}m`;
      case 'hours':
      case 'hour':
        return `${value}h`;
      case 'days':
      case 'day':
        return format(parseISO(chirpData.postTime), 'MMMM d');
      case 'years':
      case 'year':
        return format(parseISO(chirpData.postTime), 'MMMM d, yyyy');
      default:
        return `${distance}`;
    }
  }

  const handleChirpClick = (e) => {
    const divClass = e.target.classList[0];
    if (
      divClass === 'chirp' ||
      divClass === 'chirpWords' ||
      divClass === 'chirpIcons'
    ) {
      /* If any of these are clicked, redirect to chirp page */
      navigate(`/chirp/${chirpData.chirpId}`);
    }
  };

  const handleLikeToggle = async () => {
    try {
      // Pre-emptively set isLiked state for responsive UI
      if (isLiked) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }

      // Update the chirp's likes and current user's likes
      const chirpDoc = await getChirp(chirpData.chirpId);
      const userDoc = await getAccount(user.userId);

      // Check if the user has it liked, if not, like it, if they do, unlike it
      for (let i = 0; i < user.likes.length; i++) {
        if (user.likes[i].chirpId === chirpData.chirpId) {
          updateDoc(chirpDoc.ref, {
            likes: arrayRemove(user.userId),
          });
          updateDoc(userDoc.ref, {
            likes: arrayRemove(user.likes[i]),
          });
          return;
        }
      }
      updateDoc(chirpDoc.ref, {
        likes: arrayUnion(user.userId),
      });
      updateDoc(userDoc.ref, {
        likes: arrayUnion(chirpData),
      });
    } catch (error) {
      console.log('Failed to like chirp.' + error);
    }
  };

  return (
    <>
      {displayMore ? (
        <div
          className="clickDetector"
          onClick={() => {
            setDisplayMore(false);
          }}
        ></div>
      ) : null}
      <div className="chirp" onClick={handleChirpClick}>
        {displayMore ? (
          <MoreMenu
            chirpData={chirpData}
            killMenu={() => {
              setDisplayMore(false);
            }}
          />
        ) : null}
        <ProfilePic
          picURL={account.picURL}
          onClick={() => {
            navigate(`/profile/${account.userId}`);
          }}
        />
        <div className="chirpInfo">
          <p
            className="name"
            onClick={() => {
              navigate(`/profile/${account.userId}`);
            }}
          >
            {account.name}
          </p>
          <p
            className="at"
            onClick={() => {
              navigate(`/profile/${account.userId}`);
            }}
          >
            @{account.username}
          </p>
          <div className="separator"></div>
          <p className="time">{formatDistanceShort()}</p>
          <div
            className="settingContainer"
            onClick={() => {
              setDisplayMore(true);
            }}
          >
            <img src={More} alt="" />
          </div>
        </div>
        <div className="chirpSubmit">
          <div className="chirpWords">{chirpData.text}</div>
          {chirpData.imageURL ? (
            <img src={chirpData.imageURL} alt="" className="chirpImage" />
          ) : null}
        </div>
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
            <p className="count">
              {chirpData.likes.length > 0 ? chirpData.likes.length : null}
            </p>
          </div>
          <div className="icon share">
            <div className="container">
              <img src={Share} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

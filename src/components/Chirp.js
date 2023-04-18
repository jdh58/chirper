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
import ChirpIcons from './ChirpIcons';
import addTags from '../addTags';

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
  const [chirpText, setChirpText] = useState();

  useEffect(() => {
    if (profile) {
      setAccount(profile);
    } else {
      (async () => {
        const accountDocs = await getAccount(chirpData.accountId);

        setAccount(accountDocs.data());
      })();
    }
  }, [chirpData, profile]);

  useEffect(() => {
    setChirpText(addTags(chirpData.text));
  }, [chirpData]);

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
      divClass === 'chirpIcons' ||
      divClass === 'normalText'
    ) {
      /* If any of these are clicked, redirect to chirp page */
      navigate(`/chirp/${chirpData.chirpId}`);
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
          <div className="chirpWords">{chirpText}</div>
          {chirpData.imageURL ? (
            <img src={chirpData.imageURL} alt="" className="chirpImage" />
          ) : null}
        </div>
        <ChirpIcons chirpData={chirpData} fullPage={false} />
      </div>
    </>
  );
}

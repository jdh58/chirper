import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';
import '../styles/ProfilePic.css';
import '../styles/Chirp.css';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  parseISO,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subSeconds,
  subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

export default function Chirp({ chirpData, profile }) {
  const [account, setAccount] = useState({
    name: null,
    username: null,
    image: null,
  });

  useEffect(() => {
    if (profile) {
      setAccount(profile);
    } else {
      (async () => {
        const accountDocs = await getDocs(
          query(collection(getFirestore(app)), 'accounts'),
          where('userId', '==', `${chirpData.accountId}`)
        );

        setAccount(accountDocs.docs[0].data());
      })();
    }
  }, []);

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

  return (
    <div className="chirp">
      <ProfilePic picURL={account.picURL} />
      <div className="chirpInfo">
        <p className="name">{account.name}</p>
        <p className="at">@{account.username}</p>
        <div className="separator"></div>
        <p className="time">{formatDistanceShort()}</p>
        <div className="settingContainer">
          <img src={More} alt="" />
        </div>
      </div>
      <p className="chirpWords">{chirpData.text}</p>
      <div className="chirpIcons">
        <div className="icon chat">
          <div className="container">
            <img src={Chat} alt="" />
          </div>
          <p className="count">{chirpData.replies}</p>
        </div>
        <div className="icon reChirp">
          <div className="container">
            <img src={ReChirp} alt="" />
          </div>
          <p className="count">{chirpData.reChirps}</p>
        </div>
        <div className="icon likes">
          <div className="container">
            <img src={Like} alt="" />
          </div>
          <p className="count">{chirpData.likes}</p>
        </div>
        <div className="icon share">
          <div className="container">
            <img src={Share} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

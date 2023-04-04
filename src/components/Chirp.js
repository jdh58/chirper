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
import { formatDistanceToNow, parseISO } from 'date-fns';
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
    const distance = formatDistanceToNow(parseISO(chirpData.postTime), {
      addSuffix: true,
    });
    const [value, unit] = distance.split(' ');
    switch (unit) {
      case 'than':
        return 'now';
      case 'minutes':
        return `${value}m`;
      case 'hours':
        return `${value}h`;
      default:
        return `${value}${unit.charAt(0)}`;
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

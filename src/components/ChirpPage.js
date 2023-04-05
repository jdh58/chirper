import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';
import RightBar from './RightBar';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import { useParams } from 'react-router-dom';
import ChirpModule from './ChirpModule';

export default function ChirpPage() {
  const id = useParams().id;
  const [account, setAccount] = useState(null);
  const [chirpData, setChirpData] = useState(null);

  useEffect(() => {
    (async () => {
      const chirpDoc = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('chirpId', '==', parseInt(id))
        )
      );

      console.log(chirpDoc.docs);

      setChirpData(chirpDoc.docs[0].data());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const accountDoc = await getDocs(
        query(collection(getFirestore(app), 'accounts')),
        where('userId', '==', `${chirpData.accountId}`)
      );

      setAccount(accountDoc.docs[0].data());
    })();
  }, [chirpData]);

  if (!account || !chirpData) {
    return (
      <>
        <div className="loading">Loading...</div>
        <RightBar />
      </>
    );
  }

  const handleChirpClick = () => {};

  return (
    <>
      <div className="chirpPage page">
        <header></header>
        <div className="chirp" onClick={handleChirpClick}>
          <div className="profileArea">
            <ProfilePic picURL={account.picURL} />
            <div className="chirpInfo">
              <p className="name">{account.name}</p>
              <p className="at">@{account.username}</p>
            </div>
            <div className="settingContainer">
              <img src={More} alt="" />
            </div>
          </div>

          <div className="chirpSubmit">
            <p className="chirpWords">{chirpData.text}</p>
            {chirpData.imageURL ? (
              <img src={chirpData.imageURL} alt="" className="chirpImage" />
            ) : null}
          </div>
          <div className="time">
            {format(parseISO(chirpData.postTime), 'hh:mm a')}
            <div className="separator"></div>
            {format(parseISO(chirpData.postTime), 'MMMM d, yyyy')}
          </div>
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
          <ChirpModule isReply={id} />
        </div>
      </div>
      <RightBar />
    </>
  );
}

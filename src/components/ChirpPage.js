import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';
import Back from '../assets/back.svg';
import RightBar from './RightBar';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChirpModule from './ChirpModule';
import '../styles/ChirpPage.css';
import getAccount from '../getAccount';
import getChirp from '../getChirp';
import '../styles/Chirp.css';

export default function ChirpPage() {
  const id = useParams().id;
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [chirpData, setChirpData] = useState(null);
  const [chirpReplies, setChirpReplies] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    (async () => {
      const chirpDoc = await getChirp(parseInt(id));
      setChirpData(chirpDoc.data());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const accountDoc = await getAccount(chirpData.accountId);
      setAccount(accountDoc.data());

      updateReplies();
    })();
  }, [chirpData]);

  const updateReplies = async () => {
    const replyDocs = await getDocs(
      query(
        collection(getFirestore(app), 'chirps'),
        where('isReply', '==', `${chirpData.chirpId}`)
      )
    );
    const replyList = replyDocs.docs.map((replyDoc) => {
      const replyData = replyDoc.data();
      console.log(replyData);
      return <Chirp chirpData={replyData} key={replyData.chirpId} />;
    });

    setChirpReplies(replyList);
  };

  if (!account || !chirpData) {
    return (
      <>
        <div className="loading">Loading...</div>
        <RightBar />
      </>
    );
  }

  return (
    <>
      <div className="chirpPage page">
        <header>
          <div
            className="backContainer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={Back} alt="" className="backButton" />
          </div>
          <h1 className="title">Chirp</h1>
        </header>
        <div className="pageChirp chirp">
          <div className="profileArea">
            <ProfilePic
              picURL={account.picURL}
              onClick={() => {
                navigate(`/profile/${account.userId}`);
              }}
            />
            <div
              className="chirpInfo"
              onClick={() => {
                navigate(`/profile/${account.userId}`);
              }}
            >
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
            {format(parseISO(chirpData.postTime), 'h:mm a')}
            <div className="separator"></div>
            {format(parseISO(chirpData.postTime), 'MMMM d, yyyy')}
          </div>
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
              <p className="count">{chirpData.likes.length}</p>
              <p className="label">
                {chirpData.likes.length === 1 ? 'Like' : 'Likes'}
              </p>
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
              <div className="container">
                <img src={Like} alt="" />
              </div>
            </div>
            <div className="icon share">
              <div className="container">
                <img src={Share} alt="" />
              </div>
            </div>
          </div>
        </div>
        <ChirpModule isReply={id} />
        {chirpReplies}
      </div>
      <RightBar />
    </>
  );
}

import { format, parseISO } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
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
import { useNavigate, useParams } from 'react-router-dom';
import ChirpModule from './ChirpModule';
import '../styles/ChirpPage.css';
import getAccount from '../getAccount';
import getChirp from '../getChirp';
import '../styles/Chirp.css';
import UserContext from '../UserContext';
import ChirpIcons from './ChirpIcons';
import addTags from '../addTags';
import ToastContext from '../ToastContext';

export default function ChirpPage() {
  const displayToast = useContext(ToastContext);
  const id = useParams().id;
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [chirpData, setChirpData] = useState(null);
  const [chirpReplies, setChirpReplies] = useState(null);
  const [chirpText, setChirpText] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      const chirpDoc = await getChirp(parseInt(id));
      setChirpData(chirpDoc.data());
    })();
  }, [id]);

  useEffect(() => {
    if (chirpData) {
      (async () => {
        const accountDoc = await getAccount(chirpData.accountId);
        setAccount(accountDoc.data());

        updateReplies();
      })();

      setChirpText(addTags(chirpData.text, navigate, displayToast));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chirpData]);

  const updateReplies = async () => {
    const replyDocs = await getDocs(
      query(
        collection(getFirestore(app), 'chirps'),
        where('replyTo', '==', `${chirpData.chirpId}`)
      )
    );
    console.log('get chirps for update replies');

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
            <p className="chirpWords">{chirpText}</p>
            {chirpData.imageURL ? (
              <img src={chirpData.imageURL} alt="" className="chirpImage" />
            ) : null}
          </div>
          <div className="time">
            {format(parseISO(chirpData.postTime), 'h:mm a')}
            <div className="separator"></div>
            {format(parseISO(chirpData.postTime), 'MMMM d, yyyy')}
          </div>
          <ChirpIcons
            chirpData={chirpData}
            fullPage={true}
            key={chirpData.chirpId}
          />
        </div>
        <ChirpModule isReply={true} replyTo={id} />
        {chirpReplies}
      </div>
      <RightBar />
    </>
  );
}

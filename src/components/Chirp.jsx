import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import '../styles/ProfilePic.css';
import '../styles/Chirp.css';
import { useContext, useEffect, useState } from 'react';
import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import MoreMenu from './MoreMenu';
import getAccount from '../getAccount';
import ChirpIcons from './ChirpIcons';
import addTags from '../addTags';
import ToastContext from '../ToastContext';
import ReChirp from '../assets/rechirp.svg';

export default function Chirp({ chirpData, profile }) {
  const displayToast = useContext(ToastContext);
  const navigate = useNavigate();
  const [displayMore, setDisplayMore] = useState(false);
  const [account, setAccount] = useState({
    name: null,
    username: null,
    image: null,
  });
  const urlId = useParams().id;
  const [chirpText, setChirpText] = useState(null);
  const [isReChirp, setIsReChirp] = useState(false);
  const [reChirpUser, setReChirpUser] = useState(null);

  useEffect(() => {
    if (profile) {
      setAccount(profile);
    } else {
      (async () => {
        const accountDocs = await getAccount(chirpData.accountId);

        setAccount(accountDocs.data());
      })();
    }

    if (chirpData.reChirps.includes(urlId)) {
      setIsReChirp(true);
    } else {
      setIsReChirp(false);
    }
  }, [chirpData, profile, urlId]);

  useEffect(() => {
    setChirpText(addTags(chirpData.text, navigate, displayToast));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    (async () => {
      if (isReChirp) {
        const reChirpUserDoc = await getAccount(urlId);

        const reChirpName = reChirpUserDoc.data().name;

        setReChirpUser(reChirpName);
      }
    })();
  }, [isReChirp]);

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
      <div
        className={isReChirp ? 'chirp reChirped' : 'chirp'}
        onClick={handleChirpClick}
      >
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
        <div className="chirpHeader">
          {isReChirp ? (
            <div className="reChirpHeader">
              <img src={ReChirp} alt="" />
              <p>{`${reChirpUser} ReChirped`}</p>
            </div>
          ) : null}
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

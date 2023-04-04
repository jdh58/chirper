import RightBar from './RightBar';
import Back from '../assets/back.svg';
import Calendar from '../assets/calendar.svg';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import Tab from './Tab';
import '../styles/page.css';
import '../styles/Profile.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import existCheck from '../existCheck';

export default function Profile() {
  const profileId = useParams().id;
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('chirps');
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    following: '',
    followers: '',
  });

  useEffect(() => {
    (async () => {
      const profileDocs = await existCheck(profileId);
      if (!profileDocs) {
        return;
      }
      const profileInfo = profileDocs[0].data();
      setProfile(profileInfo);
    })();
  }, []);

  console.log(profileId);

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="profilePage page">
        <header>
          <div
            className="backContainer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={Back} alt="" className="backButton" />
          </div>
          <div className="info">
            <p className="name">{profile.name}</p>
            <p className="chirps">598 Chirps</p>
          </div>
        </header>
        <div className="banner">
          <img src="" alt="" className="banner" />
        </div>
        <div className="profileInfo">
          <ProfilePic />
          <div className="accountNames">
            <h1 className="name">{profile.name}</h1>
            <h2 className="at">@{profile.username}</h2>
          </div>
          <p className="bio">{}</p>
          <div className="joinDate">
            <img src={Calendar} alt="" />
            <p>Joined February 2019</p>
          </div>
          <div className="followStats">
            <p className="following">
              <span className="number">0</span> Following
            </p>
            <p className="followers">
              <span className="number">153</span> Followers
            </p>
          </div>
        </div>
        <div className="tabs">
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Chirps'}
            className={'chirps'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Replies'}
            className={'replies'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Media'}
            className={'media'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Likes'}
            className={'likes'}
          />
          <div className={`indicator ${currentTab}`}></div>
        </div>
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
        <Chirp />
      </div>
      <RightBar />
    </>
  );
}

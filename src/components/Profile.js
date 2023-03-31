import RightBar from './RightBar';
import Back from '../assets/back.svg';
import Calendar from '../assets/calendar.svg';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import '../styles/page.css';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

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
            <p className="name">Terry J. ~ (⚾ 100 WINS) ~ YANKS4LYFE</p>
            <p className="chirps">598 Chirps</p>
          </div>
        </header>
        <div className="banner">
          <img src="" alt="" className="banner" />
        </div>
        <div className="profileInfo">
          <ProfilePic />
          <div className="accountNames">
            <h1 className="name">Terry J. ~ (⚾ 100 WINS) ~ YANKS4LYFE</h1>
            <h2 className="at">@T_J_Enesis</h2>
          </div>
          <p className="bio">
            Yankees 🖤 - Lakers 💛💜 - Cowboys 💙~ "What comes to truth never
            comes to light." - John F. Kennedy 1961
          </p>
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
          <div className="chirps subheader">
            <h2>Chirps</h2>
          </div>
          <div className="replies subheader">
            <h2>Replies</h2>
          </div>
          <div className="media subheader">
            <h2>Media</h2>
          </div>
          <div className="likes subheader">
            <h2>Likes</h2>
          </div>
          <div className={`indicator`}></div>
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

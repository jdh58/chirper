import RightBar from './RightBar';
import Back from './back.svg';
import Calendar from './calendar.svg';
import Chirp from './Chirp';
import '../styles/page.css';
import '../styles/Profile.css';

export default function Profile() {
  return (
    <>
      <div className="profilePage page">
        <header>
          <div className="backContainer">
            <img src={Back} alt="" className="backButton" />
          </div>
          <div className="info">
            <p className="name">Terry J. ~ (100 WINS) ~ YANKS4LYFE</p>
            <p className="chirps">598 Chirps</p>
          </div>
        </header>
        <div className="banner">
          <img src="" alt="" className="banner" />
        </div>
        <div className="profileInfo">
          <img src="" alt="" className="profilePic" />
          <h1 className="name">Terry J. ~ (100 WINS) ~ YANKS4LYFE</h1>
          <h2 className="at">@T_J_Enesis</h2>
          <p className="bio">
            Yankees 🖤 - Lakers 💛💜 - Cowboys 💙~ "What comes to truth never
            comes to light." - John F. Kennedy 1961
          </p>
          <div className="joinDate">
            <img src={Calendar} alt="" />
            <p>Joined February 2019</p>
          </div>
          <div className="followStats">
            <p className="following">0 Following</p>
            <p className="followers">153 followers</p>
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

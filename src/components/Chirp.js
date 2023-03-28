import ProfilePic from './ProfilePic';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReChirp from '../assets/rechirp.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';
import '../styles/ProfilePic.css';
import '../styles/Chirp.css';

export default function Chirp() {
  return (
    <div className="chirp">
      <ProfilePic />
      <div className="chirpInfo">
        <p className="name">Full Clout</p>
        <p className="at">@FullClout</p>
        <div className="separator"></div>
        <p className="time">16m</p>
        <div className="settingContainer">
          <img src={More} alt="" />
        </div>
      </div>
      <p className="chirpWords">
        Kang Actor's ex-coworkers have no love for the dude. Looks like we may
        be getting Dr. Doom!
      </p>
      <div className="chirpIcons">
        <div className="icon chat">
          <div className="container">
            <img src={Chat} alt="" />
          </div>
          <p className="count">23</p>
        </div>
        <div className="icon reChirp">
          <div className="container">
            <img src={ReChirp} alt="" />
          </div>
          <p className="count">3,426</p>
        </div>
        <div className="icon likes">
          <div className="container">
            <img src={Like} alt="" />
          </div>
          <p className="count">384K</p>
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

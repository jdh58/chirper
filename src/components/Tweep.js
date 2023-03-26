import Pic from '../assets/fakepic.jpeg';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReTweep from '../assets/retweep.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';
import '../styles/Tweep.css';

export default function Tweep() {
  return (
    <div className="tweep">
      <div className="profilePicContainer">
        <img src={Pic} alt="" />
      </div>
      <div className="tweepInfo">
        <p className="name">Full Clout</p>
        <p className="at">@FullClout</p>
        <div className="separator"></div>
        <p className="time">16m</p>
        <div className="settingContainer">
          <img src={More} alt="" />
        </div>
      </div>
      <p className="tweepWords">
        Kang Actor's ex-coworkers have no love for the dude. Looks like we may
        be getting Dr. Doom!
      </p>
      <div className="tweepIcons">
        <div className="icon chat">
          <div className="container">
            <img src={Chat} alt="" />
          </div>
        </div>
        <div className="icon reTweep">
          <div className="container">
            <img src={ReTweep} alt="" />
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
  );
}

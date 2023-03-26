import Pic from '../assets/fakepic.jpeg';
import More from '../assets/more.svg';
import Chat from '../assets/chat.svg';
import ReTweep from '../assets/retweep.svg';
import Like from '../assets/like.svg';
import Share from '../assets/share.svg';

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
        <div className="chat">
          <img src={Chat} alt="" />
        </div>
        <div className="reTweep">
          <img src={ReTweep} alt="" />
        </div>
        <div className="likes">
          <img src={Like} alt="" />
        </div>
        <div className="share">
          <img src={Share} alt="" />
        </div>
      </div>
    </div>
  );
}

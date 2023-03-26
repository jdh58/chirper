import Pic from '../assets/fakepic.jpeg';
import TweepButton from './TweepButton';
import GifBox from '../assets/gifbox.svg';
import ImageIcon from '../assets/image.svg';
import Poll from '../assets/list.svg';
import Emoji from '../assets/smile.svg';
import Clock from '../assets/clock.svg';
import Pin from '../assets/map-pin.svg';
import '../styles/TweepModule.css';

export default function TweepModule() {
  const autoGrow = (e) => {
    const element = e.target;

    element.style.height = '54px';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div className="tweepModule">
      <div className="tweepWriting">
        <img src={Pic} alt="" className="profilePic" />
        <textarea
          name="tweepInput"
          id="tweepInput"
          placeholder="What's Happening?"
          onChange={autoGrow}
        />
      </div>
      <div className="toolbar">
        <div className="icons">
          <img src={ImageIcon} alt="" className="icon" />
          <img src={GifBox} alt="" className="icon gif" />
          <img src={Poll} alt="" className="icon" />
          <img src={Emoji} alt="" className="icon" />
          <img src={Clock} alt="" className="icon" />
          <img src={Pin} alt="" className="icon" />
        </div>
        <TweepButton />
      </div>
    </div>
  );
}

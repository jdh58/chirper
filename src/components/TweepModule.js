import Pic from '../assets/fakepic.jpeg';
import TweepButton from './TweepButton';
import GifBox from '../assets/gifbox.svg';
import ImageIcon from '../assets/image.svg';
import Poll from '../assets/list.svg';
import Emoji from '../assets/smile.svg';
import Clock from '../assets/clock.svg';
import Pin from '../assets/map-pin.svg';
import '../styles/TweepModule.css';
import { useState } from 'react';

export default function TweepModule() {
  const [characters, setCharacters] = useState(0);

  const autoGrow = (e) => {
    const element = e.target;

    console.log(element.scrollHeight);
    element.style.height = '54px';
    console.log(element.scrollHeight);
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleTweepChange = (event) => {
    // Make sure the box size changes dynamically
    autoGrow(event);

    // Disable the button if there's no text, otherwise enable it.
    if (event.target.value.length === 0) {
      document
        .querySelector('.tweepModule .tweepButton')
        .setAttribute('disabled', '');
    } else {
      document
        .querySelector('.tweepModule .tweepButton')
        .removeAttribute('disabled');
    }

    // Update character count
    setCharacters(event.target.value.length);
  };

  return (
    <div className="tweepModule">
      <div className="tweepWriting">
        <img src={Pic} alt="" className="profilePic" />
        <textarea
          name="tweepInput"
          id="tweepInput"
          placeholder="What's Happening?"
          onChange={handleTweepChange}
          maxLength="280"
        />
      </div>
      <div className="toolbar">
        <div className="icons">
          <span className="iconContainer">
            <img src={ImageIcon} alt="" className="icon" />
          </span>
          <span className="iconContainer">
            <img src={GifBox} alt="" className="icon gif" />
          </span>
          <span className="iconContainer">
            <img src={Poll} alt="" className="icon" />
          </span>
          <span className="iconContainer">
            <img src={Emoji} alt="" className="icon" />
          </span>
          <span className="iconContainer">
            <img src={Clock} alt="" className="icon" />
          </span>
          <span className="iconContainer">
            <img src={Pin} alt="" className="icon" />
          </span>
        </div>
        <p
          className="characterCount"
          style={characters > 270 ? { color: 'red' } : null}
        >
          {characters > 0 ? `${characters}/280` : null}
        </p>
        <TweepButton disabled="disabled" />
      </div>
    </div>
  );
}

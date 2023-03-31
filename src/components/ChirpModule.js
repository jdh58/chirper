import Pic from '../assets/fakepic.jpeg';
import ChirpButton from './ChirpButton';
import GifBox from '../assets/gifbox.svg';
import ImageIcon from '../assets/image.svg';
import Poll from '../assets/list.svg';
import Emoji from '../assets/smile.svg';
import Clock from '../assets/clock.svg';
import Pin from '../assets/map-pin.svg';
import Close from '../assets/close.svg';
import '../styles/ChirpModule.css';
import { useState } from 'react';

export default function ChirpModule({ overlay, killModule }) {
  const [characters, setCharacters] = useState(0);

  const autoGrow = (e) => {
    const element = e.target;

    element.style.height = '54px';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleChirpChange = (event) => {
    // Make sure the box size changes dynamically if it's not an overlay
    if (!overlay) {
      autoGrow(event);
    }

    // Disable the button if there's no text, otherwise enable it.
    if (event.target.value.length === 0) {
      document
        .querySelector('.chirpModule .chirpButton')
        .setAttribute('disabled', '');
    } else {
      document
        .querySelector('.chirpModule .chirpButton')
        .removeAttribute('disabled');
    }

    // Update character count
    setCharacters(event.target.value.length);
  };

  return (
    <div
      className={
        overlay ? 'chirpModuleContainer overlay' : 'chirpModuleContainer'
      }
    >
      <div className="chirpModule">
        {overlay ? (
          <img src={Close} alt="" className="close" onClick={killModule} />
        ) : null}
        <div className="chirpWriting">
          <img src={Pic} alt="" className="profilePic" />
          <textarea
            name="chirpInput"
            id="chirpInput"
            placeholder="What's happening?"
            onChange={handleChirpChange}
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
          <ChirpButton disabled="disabled" />
        </div>
      </div>
    </div>
  );
}

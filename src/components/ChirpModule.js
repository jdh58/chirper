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
import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';
import { upload } from '@testing-library/user-event/dist/upload';

export default function ChirpModule({ overlay, killModule, isReply }) {
  const [characters, setCharacters] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);

  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  const autoGrow = (textBox) => {
    textBox.style.height = '54px';
    textBox.style.height = `${textBox.scrollHeight}px`;
  };

  const handleChirpChange = (textBox) => {
    if (!textBox.nodeName) {
      textBox = textBox.target;
    }

    // Make sure the box size changes dynamically if it's not an overlay
    if (!overlay) {
      autoGrow(textBox);
    }

    // Disable the button if there's no text, otherwise enable it.
    if (textBox.value.length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    // Update character count
    setCharacters(textBox.value.length);
  };

  const handleImageAdded = (e) => {
    console.log('triggered');
    const file = URL.createObjectURL(e.target.files[0]);

    if (e) {
      setUploadedImage(
        <div className="uploadedImage">
          <div
            className="closeContainer"
            onClick={() => {
              setUploadedImage(null);
            }}
          >
            <img src={Close} alt="" className="close" />
          </div>
          <img src={file} alt="" className="thePic" />
        </div>
      );
    }
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
            placeholder={isReply ? 'Chirp your reply' : "What's happening?"}
            onChange={handleChirpChange}
            maxLength="280"
          />
          {uploadedImage}
        </div>
        <div className="toolbar">
          <div className="icons">
            <span className="iconContainer">
              <input
                type="file"
                name="imageInput"
                id="imageInput"
                onInput={handleImageAdded}
              />
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
          <ChirpButton
            disabled={disabled}
            isReply={isReply}
            handleChirpChange={handleChirpChange}
          />
        </div>
      </div>
    </div>
  );
}

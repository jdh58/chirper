import { useState } from 'react';
import ChirpModule from './ChirpModule';
import '../styles/ChirpButton.css';

export default function NavChirpButton(props) {
  return (
    <>
      <button className="chirpButton nav" onClick={props.chirpOverlay}>
        Chirp
      </button>
    </>
  );
}

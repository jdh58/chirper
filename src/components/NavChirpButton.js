import { useState } from 'react';
import ChirpModule from './ChirpModule';
import '../styles/ChirpButton.css';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';

export default function NavChirpButton(props) {
  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  return (
    <>
      <button className="chirpButton nav" onClick={props.chirpOverlay}>
        <p>Chirp</p>
      </button>
    </>
  );
}

import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../firebase-config';
import '../styles/ChirpButton.css';

export default function ChirpButton({ disabled, isReply, handleChirpChange }) {
  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  const handleSendChirp = async (e) => {
    // Prevent user from double chirping
    e.target.disabled = true;

    // We go up from the button to ensure we grab the corresponding input
    const chirpModule = e.target.parentElement.parentElement;
    const textBox = chirpModule.querySelector('#chirpInput');
    const text = textBox.value;
    const attatchment = null;
    const accountId = getAuth(app).currentUser.uid;
    let chirpId = null;

    // Clear box once value is saved, and let the module know to update
    chirpModule.querySelector('#chirpInput').value = '';
    handleChirpChange(textBox);

    // Generate a random number from 1 to 100 trillion and check if the id already exists.
    let repeat = true;
    while (repeat === true) {
      chirpId = Math.floor(Math.random() * 100000000000000);
      const existing = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('chirpId', '==', `${chirpId}`)
        )
      ).docs;

      if (!existing) {
        repeat = false;
      }
    }

    await addDoc(collection(getFirestore(app), 'chirps'), {
      accountId,
      chirpId,
      text,
      attatchment,
      isReply,
    });

    // Here we should add a popup to let the user know a chirp was sent

    // Let user from chirp again
    e.target.disabled = false;
  };

  return (
    <button
      disabled={disabled}
      className="chirpButton"
      onClick={handleSendChirp}
    >
      {isReply ? 'Reply' : 'Chirp'}
    </button>
  );
}

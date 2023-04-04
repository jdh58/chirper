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

export default function ChirpButton({
  disabled,
  isReply,
  handleChirpChange,
  displayToast,
  uploadedImage,
  killUploadedImage,
}) {
  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  const handleSendChirp = async (e) => {
    // We go up from the button to ensure we grab the corresponding input
    const chirpModule = e.target.parentElement.parentElement;
    const textBox = chirpModule.querySelector('#chirpInput');
    const text = textBox.value;
    const imageInput = chirpModule.querySelector('#imageInput');
    const image = uploadedImage;
    const accountId = getAuth(app).currentUser.uid;
    let chirpId = null;

    /* Clear box + image once value is saved, and let the module know to 
    update. This also disables the button so the user can't double Chirp. */
    textBox.value = '';
    killUploadedImage();
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

    // If there was an image, store it

    // Log the chirp to the database
    await addDoc(collection(getFirestore(app), 'chirps'), {
      accountId,
      chirpId,
      text,
      image,
      isReply,
    });

    // Display a notification to let the user know a chirp was sent
    displayToast('Your Chirp was sent.');
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

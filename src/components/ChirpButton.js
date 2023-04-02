import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../firebase-config';
import '../styles/ChirpButton.css';

export default function ChirpButton({ disabled }) {
  const handleSendChirp = async (e) => {
    console.log(e.target.composedPath(1));

    // const text = document.querySelector('#')
    // const img = null;
    // await addDoc(collection(getFirestore(app), 'chirps'), {
    //   text:
    //   img: null;
    // })
  };

  return (
    <button
      disabled={disabled}
      className="chirpButton"
      onClick={handleSendChirp}
    >
      Chirp
    </button>
  );
}

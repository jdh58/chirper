import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../firebase-config';
import '../styles/ChirpButton.css';

export default function ChirpButton({ disabled, isReply }) {
  const handleSendChirp = async (e) => {
    const chirpModule = e.target.parentElement.parentElement;

    const text = chirpModule.querySelector('#chirpInput').value;
    const attatchment = null;

    const bnana = await query(collection(getFirestore(app), 'accounts'));

    const docs = await getDocs(bnana);

    const account = docs.docs[0].data();

    console.log(account.id);

    // await addDoc(collection(getFirestore(app), 'chirps'), {
    //   text,
    //   attatchment,
    //   isReply,
    // });
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

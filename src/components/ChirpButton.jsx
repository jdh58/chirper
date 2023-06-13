import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { app } from '../firebase-config';
import '../styles/ChirpButton.css';
import UserContext from '../UserContext';

export default function ChirpButton({ disabled, isReply, handleSendChirp }) {
  const user = useContext(UserContext);

  // We don't want non-users chirping
  if (!user) {
    return null;
  }

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

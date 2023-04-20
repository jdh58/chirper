import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';
import '../styles/ChirpButton.css';

export default function ChirpButton({ disabled, isReply, handleSendChirp }) {
  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
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

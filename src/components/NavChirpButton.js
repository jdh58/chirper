import '../styles/ChirpButton.css';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';
import Compose from '../assets/compose.png';

export default function NavChirpButton(props) {
  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  return (
    <>
      <button className="chirpButton nav" onClick={props.chirpOverlay}>
        <p>Chirp</p>
        <img src={Compose} alt="" />
      </button>
    </>
  );
}

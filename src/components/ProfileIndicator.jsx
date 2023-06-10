import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase-config';
import LogOut from '../assets/logout.svg';
import ProfilePic from './ProfilePic';
import '../styles/ProfileIndicator.css';

export default function ProfileIndicator({ user }) {
  return (
    <div className="profileIndicator">
      <ProfilePic picURL={user.picURL} noOverlay={true} />
      <div className="profileNames">
        <div className="name">{user.name}</div>
        <div className="username">@{user.username}</div>
      </div>
      <div
        className="signOut"
        onClick={() => {
          signOut(getAuth(app));
        }}
      >
        <img src={LogOut} alt="" />
      </div>
    </div>
  );
}

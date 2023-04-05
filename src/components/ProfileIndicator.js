import { getAuth, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { app } from '../firebase-config';
import UserContext from '../UserContext';
import ProfilePic from './ProfilePic';

export default function ProfileIndicator({ user }) {
  return (
    <div className="ProfileIndicator">
      <ProfilePic picURL={user.picURL} />
      <div className="profileNames">
        <div className="name">{user.name}</div>
        <div className="userName">{user.username}</div>
      </div>
      <button
        className="signOut"
        onClick={() => {
          signOut(getAuth(app));
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

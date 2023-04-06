import ProfilePic from './ProfilePic';
import '../styles/AccountModule.css';

export default function AccountModule({ profile }) {
  return (
    <div className="accountModule">
      <ProfilePic picURL={profile.picURL} />
      <div className="accountInfo">
        <p className="name">{profile.name}</p>
        <p className="at">@{profile.username}</p>
      </div>
      <button className="follow">Follow</button>
    </div>
  );
}

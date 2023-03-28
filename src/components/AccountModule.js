import ProfilePic from './ProfilePic';
import '../styles/AccountModule.css';

export default function AccountModule() {
  return (
    <div className="accountModule">
      <ProfilePic />
      <div className="accountInfo">
        <p className="name">Full Clout</p>
        <p className="at">@marlon_humphrey</p>
      </div>
      <button className="follow">Follow</button>
    </div>
  );
}

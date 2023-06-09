import ProfilePic from './ProfilePic';
import '../styles/AccountModule.css';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

export default function AccountModule({ profile }) {
  const navigate = useNavigate();

  const handleAccountClick = (e) => {
    if (e.target.nodeName !== 'BUTTON') {
      navigate(`/profile/${profile.userId}`);
    }
  };

  return (
    <div
      className="accountModule"
      onClick={handleAccountClick}
      data-testid="account-module"
    >
      <ProfilePic picURL={profile.picURL} />
      <div className="accountInfo">
        <p className="name">{profile.name}</p>
        <p className="at">@{profile.username}</p>
      </div>
      <FollowButton clickedUser={profile} isProfile={false} />
    </div>
  );
}

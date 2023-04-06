import { useContext } from 'react';
import UserContext from '../UserContext';

export default function MoreMenu({ chirpData }) {
  const user = useContext(UserContext);

  return (
    <div className="moreMenu">
      <div className="bookmark">
        <img src="" alt="" />
      </div>
      {user.userId === chirpData.accountId ? (
        <div className="delete"></div>
      ) : null}

      <div className="bookmark"></div>
    </div>
  );
}

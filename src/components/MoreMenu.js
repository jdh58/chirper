import { useContext, useEffect } from 'react';
import UserContext from '../UserContext';
import Delete from '../assets/delete.svg';
import Bookmark from '../assets/bookmark.svg';
import '../styles/MoreMenu.css';

export default function MoreMenu({ chirpData }) {
  const user = useContext(UserContext);

  return (
    <div className="moreMenu more">
      {user.userId === chirpData.accountId ? (
        <div className="delete option">
          <img src={Delete} alt="" />
          <p>Delete</p>
        </div>
      ) : null}
      <div className="bookmark option">
        <img src={Bookmark} alt="" />
        <p>Bookmark</p>
      </div>
    </div>
  );
}

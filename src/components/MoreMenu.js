import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import Delete from '../assets/delete.svg';
import Bookmark from '../assets/bookmark.svg';
import '../styles/MoreMenu.css';

export default function MoreMenu({ chirpData }) {
  const [isUsers, setIsUsers] = useState(false);

  const user = useContext(UserContext) || {
    userId: '',
  };

  // Detect if the chirp is the user's, so we know if we show delete
  useEffect(() => {
    if (user.userId === chirpData.accountId) {
      setIsUsers(true);
    }
  }, []);

  const handleDelete = () => {};

  return (
    <div className={isUsers ? 'moreMenu users' : 'moreMenu'}>
      {isUsers ? (
        <div className="delete option" onClick={handleDelete}>
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

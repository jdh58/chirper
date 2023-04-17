import { useContext, useEffect, useState } from 'react';
import getChirp from '../getChirp';
import UserContext from '../UserContext';
import Chirp from './Chirp';
import RightBar from './RightBar';
import '../styles/BookmarkPage.css';

export default function BookmarkPage() {
  const user = useContext(UserContext);
  const [bookmarkedChirps, setBookmarkedChirps] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('if was true');
      (async () => {
        try {
          const chirpList = await Promise.all(
            user.bookmarks.map(async (chirpId) => {
              return await getChirp(chirpId);
            })
          );
          console.log(chirpList);

          setBookmarkedChirps(
            chirpList.map((chirpDoc) => {
              const chirpData = chirpDoc.data();
              return <Chirp chirpData={chirpData} />;
            })
          );
        } catch (error) {
          console.error('Could not fetch bookmarks', error);
        }
      })();
    }
    console.log('fish');
  }, [user]);

  return (
    <>
      <div className="bookmarkPage page">
        <header>
          <div className="info">
            <p className="name">Bookmarks</p>
            <p className="at">@{user.username}</p>
          </div>
        </header>
        {bookmarkedChirps}
      </div>
      <RightBar />
    </>
  );
}
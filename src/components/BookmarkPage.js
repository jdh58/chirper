import { useContext, useEffect, useState } from 'react';
import getChirp from '../getChirp';
import UserContext from '../UserContext';
import Chirp from './Chirp';
import RightBar from './RightBar';
import Header from './Header';
import LoadingIcon from '../assets/loading.svg';

export default function BookmarkPage() {
  const user = useContext(UserContext);
  const [bookmarkedChirps, setBookmarkedChirps] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!hasLoaded) {
      (async () => {
        try {
          const bookmarkArray = user.bookmarks.slice().reverse();

          const chirpList = await Promise.all(
            bookmarkArray.map(async (chirpId) => {
              return await getChirp(chirpId);
            })
          );

          setBookmarkedChirps(
            chirpList.map((chirpDoc) => {
              const chirpData = chirpDoc.data();
              console.log(chirpData);
              return <Chirp chirpData={chirpData} />;
            })
          );

          setHasLoaded(true);
        } catch (error) {
          console.error('Could not fetch bookmarks', error);
        }
      })();
    }
  }, [user, hasLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  });

  return (
    <>
      <div className="bookmarkPage page">
        {loading ? (
          <div className="noHeaderLoading loading">
            <img src={LoadingIcon} alt="" className="loadingIcon" />
          </div>
        ) : null}
        <Header
          hasBack={false}
          top="Bookmarks"
          bottom={`@${user !== null ? user.username : ''}`}
        />
        {bookmarkedChirps}
      </div>
      <RightBar />
    </>
  );
}

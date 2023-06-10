import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { app } from '../firebase-config';
import UserContext from '../UserContext';
import Chirp from './Chirp';
import Header from './Header';
import RightBar from './RightBar';
import LoadingIcon from '../assets/loading.svg';

export default function NotificationPage() {
  const user = useContext(UserContext);
  const [mentions, setMentions] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!hasLoaded) {
      (async () => {
        try {
          const mentionDocs = await getDocs(
            query(
              collection(getFirestore(app), 'chirps'),
              where('tags', 'array-contains', `@${user.username}`)
            )
          );
          console.log('get chirp for mentions');

          setMentions(
            mentionDocs.docs.map((doc) => {
              const mentionData = doc.data();
              return <Chirp chirpData={mentionData} />;
            })
          );

          setHasLoaded(true);
        } catch (error) {
          console.error('Failed to access mentions', error);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  });

  return (
    <>
      <div className="notificationPage page">
        {loading ? (
          <div className="noHeaderLoading loading">
            <img src={LoadingIcon} alt="" className="loadingIcon" />
          </div>
        ) : null}
        <Header
          top="Notifications"
          bottom={user ? `@${user.username}` : null}
        />

        {mentions}
      </div>
      <RightBar />
    </>
  );
}

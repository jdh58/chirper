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

export default function NotificationPage() {
  const user = useContext(UserContext);
  const [mentions, setMentions] = useState(null);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const mentionDocs = await getDocs(
            query(
              collection(getFirestore(app), 'chirps'),
              where('tags', 'array-contains', `@${user.username}`)
            )
          );
          console.log('get chirp for mentions');

          console.log(mentionDocs.docs[0]);

          setMentions(
            mentionDocs.docs.map((doc) => {
              const mentionData = doc.data();
              return <Chirp chirpData={mentionData} />;
            })
          );
        } catch (error) {
          console.error('Failed to access mentions', error);
        }
      })();
    }
  }, [user]);

  return (
    <>
      <div className="notificationPage page">
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

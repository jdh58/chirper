import { useContext, useEffect, useState } from 'react';
import '../styles/Home.css';
import '../styles/page.css';
import Tab from './Tab';
import RightBar from './RightBar';
import ChirpModule from './ChirpModule';
import Chirp from './Chirp';
import UserContext from '../UserContext';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const user = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('foryou');
  const [followingChirps, setFollowingChirps] = useState([]);
  const [forYouChirps, setForYouChirps] = useState([]);

  useEffect(() => {
    console.log(user);
    if (user) {
      (async () => {
        try {
          const followChirpDocs = await getDocs(
            query(
              collection(getFirestore(app), 'chirps'),
              where('accountId', 'in', user.following),
              orderBy('postTime', 'desc'),
              limit(10)
            )
          );
          console.log('fetched follow');

          const followChirpsArray = [];

          followChirpDocs.docs.forEach((chirpDoc) => {
            const chirpData = chirpDoc.data();

            followChirpsArray.push(
              <Chirp chirpData={chirpData} key={chirpData.chirpId} />
            );
          });

          setFollowingChirps(followChirpsArray);
        } catch (error) {
          console.error('Could not fetch following chirps', error);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const forYouDocs = await getDocs(
          query(
            collection(getFirestore(app), 'chirps'),
            orderBy('postTime', 'desc'),
            limit(10)
          )
        );
        console.log('fetched foryou');

        const forYouChirpsArray = [];

        forYouDocs.docs.forEach((chirpDoc) => {
          const chirpData = chirpDoc.data();

          forYouChirpsArray.push(
            <Chirp chirpData={chirpData} key={chirpData.chirpId} />
          );
        });

        setForYouChirps(forYouChirpsArray);
      } catch (error) {
        console.error('Could not fetch following chirps', error);
      }
    })();
  }, []);

  const grabMoreChirps = () => {
    return <div></div>;
  };

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="homePage page">
        <header>
          <h1 className="title">Home</h1>
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'For You'}
            className={'foryou'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Following'}
            className={'following'}
          />
          <div className={`indicator ${currentTab}`}></div>
        </header>
        <ChirpModule isReply={false} />
        {currentTab === 'foryou' ? forYouChirps : null}
        {currentTab === 'following' ? followingChirps : null}
      </div>
      <RightBar />
    </>
  );
}

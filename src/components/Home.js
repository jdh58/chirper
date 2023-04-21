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
  startAfter,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import InfiniteScroll from 'react-infinite-scroll-component';
import grabForInfinite from '../grabForInfinite';

export default function Home() {
  const user = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('foryou');
  const [followingChirps, setFollowingChirps] = useState([]);
  const [forYouChirps, setForYouChirps] = useState([]);
  const [finalForYouChirp, setFinalForYouChirp] = useState(null);
  const [forYouPage, setForYouPage] = useState(1);
  const [finalFollowingChirp, setFinalFollowingChirp] = useState(null);
  const [followingPage, setFollowingPage] = useState(1);

  useEffect(() => {
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

          setFinalFollowingChirp(
            followChirpDocs.docs[followChirpDocs.docs.length - 1]
          );
          setFollowingChirps(followChirpsArray);
        } catch (error) {
          console.error('Could not fetch following chirps', error);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    const first = true;
    grabMoreForYouChirps(first);
  }, []);

  const grabMoreForYouChirps = async (first) => {
    try {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          orderBy('postTime', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          orderBy('postTime', 'desc'),
          startAfter(finalForYouChirp),
          limit(10)
        );
      }

      let forYouGrab = await grabForInfinite(grabQuery);

      console.log(forYouChirps);
      setFinalForYouChirp(forYouGrab.finalChirp);
      setForYouChirps([...forYouChirps, ...forYouGrab.newChirps]);
      setForYouPage((forYouPage) => forYouPage + 1);
    } catch (error) {
      console.error('Could not fetch following chirps', error);
    }
  };

  const grabMoreFollowingChirps = async () => {
    try {
      const followChirpDocs = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('accountId', 'in', user.following),
          orderBy('postTime', 'desc'),
          startAfter(finalFollowingChirp),
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

      setFinalFollowingChirp(
        followChirpDocs.docs[followChirpDocs.docs.length - 1]
      );
      setFollowingChirps([...followingChirps, ...followChirpsArray]);
      setFollowingPage((followingPage) => followingPage + 1);
    } catch (error) {
      console.error('Could not fetch following chirps', error);
    }
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
        {currentTab === 'foryou' ? (
          <InfiniteScroll
            dataLength={forYouPage * 10}
            next={grabMoreForYouChirps}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {forYouChirps}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'following' ? (
          <InfiniteScroll
            dataLength={followingPage * 10}
            next={grabMoreFollowingChirps}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {followingChirps}
          </InfiniteScroll>
        ) : null}
      </div>
      <RightBar />
    </>
  );
}

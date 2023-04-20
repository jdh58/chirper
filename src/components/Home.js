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

export default function Home() {
  const user = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('foryou');
  const [followingChirps, setFollowingChirps] = useState([]);
  const [forYouChirps, setForYouChirps] = useState([]);
  const [finalForYouChirp, setFinalForYouChirp] = useState(null);
  const [page, setPage] = useState(1);

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

        console.log(forYouDocs.docs[forYouDocs.docs.length - 1].data());

        setFinalForYouChirp(forYouDocs.docs[forYouDocs.docs.length - 1]);
        setForYouChirps(forYouChirpsArray);
      } catch (error) {
        console.error('Could not fetch following chirps', error);
      }
    })();
  }, []);

  const grabMoreForYouChirps = async () => {
    try {
      console.log('GOT NEXT');
      const forYouDocs = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          orderBy('postTime', 'desc'),
          startAfter(finalForYouChirp),
          limit(10)
        )
      );
      console.log('fetched more foryou');

      const forYouChirpsArray = [];

      forYouDocs.docs.forEach((chirpDoc) => {
        const chirpData = chirpDoc.data();

        forYouChirpsArray.push(
          <Chirp chirpData={chirpData} key={chirpData.chirpId} />
        );
      });

      console.log([...forYouChirps, ...forYouChirpsArray]);

      setFinalForYouChirp(forYouDocs.docs[forYouDocs.docs.length - 1]);
      setForYouChirps([...forYouChirps, ...forYouChirpsArray]);
      setPage((page) => page + 1);
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
            dataLength={page * 10}
            next={grabMoreForYouChirps}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            scrollThreshold={0.9}
          >
            {forYouChirps}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'following' ? followingChirps : null}
      </div>
      <RightBar />
    </>
  );
}

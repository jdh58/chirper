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
import LoadingIcon from '../assets/loading.svg';

export default function Home() {
  const user = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('foryou');
  const [followingChirps, setFollowingChirps] = useState([]);
  const [forYouChirps, setForYouChirps] = useState([]);
  const [finalForYouChirp, setFinalForYouChirp] = useState(null);
  const [forYouPage, setForYouPage] = useState(1);
  const [finalFollowingChirp, setFinalFollowingChirp] = useState(null);
  const [followingPage, setFollowingPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      grabFollowingChirps(true);
    }
  }, [user]);

  useEffect(() => {
    grabForYouChirps(true);
  }, []);

  const grabForYouChirps = async (first) => {
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

  const grabFollowingChirps = async (first) => {
    try {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('accountId', 'in', user.following),
          orderBy('postTime', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('accountId', 'in', user.following),
          orderBy('postTime', 'desc'),
          startAfter(finalFollowingChirp),
          limit(10)
        );
      }

      const followingGrab = await grabForInfinite(grabQuery);

      setFinalFollowingChirp(followingGrab.finalChirp);
      setFollowingChirps([...followingChirps, ...followingGrab.newChirps]);
      setFollowingPage((followingPage) => followingPage + 1);
    } catch (error) {
      console.error('Could not fetch following chirps', error);
    }
  };

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
    window.scrollTo(0, 0);
    setLoading(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  });

  return (
    <>
      <div className="homePage page">
        {loading ? (
          <div className="homePageLoading loading">
            <img src={LoadingIcon} alt="" className="loadingIcon" />
          </div>
        ) : null}
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
            next={grabForYouChirps}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {forYouChirps}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'following' ? (
          <InfiniteScroll
            dataLength={followingPage * 10}
            next={grabFollowingChirps}
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

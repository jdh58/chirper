import { useEffect, useState } from 'react';
import '../styles/page.css';
import '../styles/SearchPage.css';
import Search from './Search';
import Tab from './Tab';
import RightBar from './RightBar';
import { useParams } from 'react-router-dom';
import grabForInfinite from '../grabForInfinite';
import grabAccountsForInfinite from '../grabAccountsForInfinite';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  or,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { v4 as uuidv4 } from 'uuid';

export default function SearchPage() {
  const defaultSearchQuery = useParams().query;
  const [currentTab, setCurrentTab] = useState('top');
  const [chirps, setChirps] = useState([]);
  const [latest, setLatest] = useState([]);
  const [people, setPeople] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [finalChirp, setFinalChirp] = useState(null);
  const [finalLatest, setFinalLatest] = useState(null);
  const [finalPeople, setFinalPeople] = useState(null);
  const [finalPhotos, setFinalPhotos] = useState(0);
  const [chirpPage, setChirpPage] = useState(0);
  const [latestPage, setLatestPage] = useState(0);
  const [peoplePage, setPeoplePage] = useState(0);
  const [photosPage, setPhotosPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState([]);
  const [defVal, setDefVal] = useState(null);

  useEffect(() => {
    setDefVal(defaultSearchQuery);
    setCurrentTab('top');
    setChirps([]);
    setLatest([]);
    setPeople([]);
    setPhotos([]);
    setFinalChirp([]);
    setFinalLatest([]);
    setFinalPeople([]);
    setFinalPhotos([]);
    setChirpPage([]);
    setLatestPage([]);
    setPeoplePage([]);
    setPhotosPage([]);
    window.scrollTo(0, 0);
    const queryArray = defaultSearchQuery.toLowerCase().split(' ');
    const decodedQueryArray = [];

    queryArray.forEach((word) => {
      decodedQueryArray.push(decodeURIComponent(word));
    });

    setSearchQuery(defaultSearchQuery.toLowerCase().split(' '));
    grabChirps(true);
  }, [defaultSearchQuery]);

  useEffect(() => {
    grabChirps(true);
  }, [searchQuery]);

  useEffect(() => {
    if (currentTab === 'top') {
      grabChirps(true);
    } else if (currentTab === 'latest') {
      grabLatest(true);
    } else if (currentTab === 'people') {
      grabPeople(true);
    } else if (currentTab === 'photos') {
      grabPhotos(true);
    }
  }, [currentTab]);

  const grabChirps = async (first) => {
    if (searchQuery.length > 0) {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          orderBy('likeCount', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          orderBy('likeCount', 'desc'),
          startAfter(finalChirp),
          limit(10)
        );
      }

      const grabbedChirps = await grabForInfinite(grabQuery);

      setFinalChirp(grabbedChirps.finalChirp);
      if (first) {
        setChirps([...grabbedChirps.newChirps]);
        setChirpPage(1);
      } else {
        setChirps([...chirps, ...grabbedChirps.newChirps]);
        setChirpPage((page) => page + 1);
      }
    }
  };

  const grabLatest = async (first) => {
    if (searchQuery.length > 0) {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          orderBy('postTime', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          orderBy('postTime', 'desc'),
          startAfter(finalLatest),
          limit(10)
        );
      }

      const grabbedChirps = await grabForInfinite(grabQuery);

      setFinalLatest(grabbedChirps.finalChirp);
      if (first) {
        setLatest([...grabbedChirps.newChirps]);
        setLatestPage(1);
      } else {
        setLatest([...latest, ...grabbedChirps.newChirps]);
        setLatestPage((page) => page + 1);
      }
    }
  };

  const grabPeople = async (first) => {
    if (searchQuery.length > 0) {
      let grabQuery;

      console.log(searchQuery);
      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'accounts'),
          or(
            where('name', 'in', searchQuery),
            where('username', 'in', searchQuery)
          ),
          orderBy('joinDate', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          or(
            where('name', 'in', searchQuery),
            where('username', 'in', searchQuery)
          ),
          orderBy('joinDate', 'desc'),
          startAfter(finalPeople),
          limit(10)
        );
      }

      const grabbedPeople = await grabAccountsForInfinite(grabQuery);

      setFinalPeople(grabbedPeople.finalAccount);
      if (first) {
        setPeople([...grabbedPeople.newAccounts]);
        setPeoplePage(1);
      } else {
        setPeople([...people, ...grabbedPeople.newAccounts]);
        setPeoplePage((page) => page + 1);
      }
    }
  };

  const grabPhotos = async (first) => {
    if (searchQuery.length > 0) {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          where('isMedia', '==', true),
          orderBy('postTime', 'desc'),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          where('isMedia', '==', true),
          orderBy('postTime', 'desc'),
          startAfter(finalPhotos),
          limit(10)
        );
      }

      const grabbedChirps = await grabForInfinite(grabQuery);

      setFinalPhotos(grabbedChirps.finalChirp);
      if (first) {
        setPhotos([...grabbedChirps.newChirps]);
        setPhotosPage(1);
      } else {
        setPhotos([...photos, ...grabbedChirps.newChirps]);
        setPhotosPage((page) => page + 1);
      }
    }
  };

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
    window.scrollTo(0, 0);
  };

  // useEffect(() => {
  //   (async () => {
  //     const docs = await getDocs(collection(getFirestore(app), 'chirps'));

  //     docs.forEach(async (chirpDoc) => {
  //       console.log(typeof chirpDoc.data().reChirps);
  //       if (typeof chirpDoc.data().reChirps != 'object') {
  //         await updateDoc(chirpDoc.ref, {
  //           reChirps: [],
  //         });
  //       }
  //     });
  //   })();
  // });

  return (
    <>
      <div className="searchPage page">
        <div className="explorePage page">
          <header>
            <Search defaultValue={defVal} />
            <Tab
              currentTab={currentTab}
              setTab={setTab}
              tabName={'Top'}
              className={'top'}
            />
            <Tab
              currentTab={currentTab}
              setTab={setTab}
              tabName={'Latest'}
              className={'latest'}
            />
            <Tab
              currentTab={currentTab}
              setTab={setTab}
              tabName={'People'}
              className={'people'}
            />
            <Tab
              currentTab={currentTab}
              setTab={setTab}
              tabName={'Photos'}
              className={'photos'}
            />
            <div className={`indicator ${currentTab}`}></div>
          </header>
          {currentTab === 'top' ? (
            <InfiniteScroll
              dataLength={chirpPage * 10}
              next={grabChirps}
              hasMore={true}
              scrollThreshold={0.9}
              key={uuidv4()}
            >
              {chirps}
            </InfiniteScroll>
          ) : null}
          {currentTab === 'latest' ? (
            <InfiniteScroll
              dataLength={latestPage * 10}
              next={grabLatest}
              hasMore={true}
              scrollThreshold={0.9}
              key={uuidv4()}
            >
              {latest}
            </InfiniteScroll>
          ) : null}
          {currentTab === 'people' ? (
            <InfiniteScroll
              dataLength={peoplePage * 10}
              next={grabPeople}
              hasMore={true}
              scrollThreshold={0.9}
              key={uuidv4()}
            >
              {people}
            </InfiniteScroll>
          ) : null}
          {currentTab === 'photos' ? (
            <InfiniteScroll
              dataLength={photosPage * 10}
              next={grabPhotos}
              hasMore={true}
              scrollThreshold={0.9}
              key={uuidv4()}
            >
              {photos}
            </InfiniteScroll>
          ) : null}
        </div>
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

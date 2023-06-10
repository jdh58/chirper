import { useEffect, useState } from 'react';
import '../styles/page.css';
import '../styles/SearchPage.css';
import Search from './Search';
import Tab from './Tab';
import RightBar from './RightBar';
import { useParams } from 'react-router-dom';
import grabForInfinite from '../grabForInfinite';
import {
  collection,
  getFirestore,
  limit,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function SearchPage() {
  const defaultSearchQuery = useParams().query;
  const [currentTab, setCurrentTab] = useState('top');
  const [chirps, setChirps] = useState([]);
  const [page, setPage] = useState(0);
  const [finalChirp, setFinalChirp] = useState(null);
  const [searchQuery, setSearchQuery] = useState([]);
  const [defVal, setDefVal] = useState(null);

  useEffect(() => {
    setDefVal(defaultSearchQuery);
    setChirps([]);
    setPage(0);
    setFinalChirp(null);
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

  const grabChirps = async (first) => {
    if (searchQuery.length > 0) {
      let grabQuery;

      if (first === true) {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          limit(10)
        );
      } else {
        grabQuery = query(
          collection(getFirestore(app), 'chirps'),
          where('wordArray', 'array-contains-any', searchQuery),
          startAfter(finalChirp),
          limit(10)
        );
      }

      console.log(searchQuery);
      const grabbedChirps = await grabForInfinite(grabQuery);

      setFinalChirp(grabbedChirps.finalChirp);
      setChirps([...chirps, ...grabbedChirps.newChirps]);
      setPage((page) => page + 1);
    }
  };

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
    window.scrollTo(0, 0);
  };

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
          <InfiniteScroll
            dataLength={page * 10}
            next={grabChirps}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {chirps}
          </InfiniteScroll>
        </div>
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

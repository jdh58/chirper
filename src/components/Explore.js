import '../styles/Explore.css';
import '../styles/page.css';
import Search from './Search.js';
import RightBar from './RightBar';
import TrendingTab from './TrendingTab';
import { useState } from 'react';

export default function Explore() {
  const [currentTab, setCurrentTab] = useState('trending');

  // TODO: Make the tabs their own component. Will do later.

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="explorePage page">
        <header>
          <Search />
          <div
            className="trending subheader"
            onClick={setTab}
            style={
              currentTab === 'trending'
                ? { opacity: '1', fontWeight: 700 }
                : { opacity: '70%', fontWeight: 600 }
            }
          >
            <h2>Trending</h2>
          </div>
          <div
            className="sports subheader"
            onClick={setTab}
            style={
              currentTab === 'sports'
                ? { opacity: '1', fontWeight: 700 }
                : { opacity: '70%', fontWeight: 600 }
            }
          >
            <h2>Sports</h2>
          </div>
          <div
            className="popularAccounts subheader"
            onClick={setTab}
            style={
              currentTab === 'popularAccounts'
                ? { opacity: '1', fontWeight: 700 }
                : { opacity: '70%', fontWeight: 600 }
            }
          >
            <h2>Popular Accounts</h2>
          </div>
          <div className={`indicator ${currentTab}`}></div>
        </header>
        {currentTab === 'trending' ? <TrendingTab /> : null}
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

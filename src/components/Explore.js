import '../styles/Explore.css';
import '../styles/page.css';
import Search from './Search.js';
import RightBar from './RightBar';
import AccountsTab from './AccountsTab';
import Tab from './Tab';
import { useState } from 'react';
import useGrabTrends from '../useGrabTrends';

export default function Explore() {
  const [currentTab, setCurrentTab] = useState('trending');
  const trendList = useGrabTrends(25);

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="explorePage page">
        <header>
          <Search />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Trending'}
            className={'trending'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Sports'}
            className={'sports'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Popular Accounts'}
            className={'popularAccounts'}
          />
          <div className={`indicator ${currentTab}`}></div>
        </header>
        {currentTab === 'trending' ? trendList : null}
        {currentTab === 'popularAccounts' ? <AccountsTab /> : null}
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

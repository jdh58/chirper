import '../styles/Explore.css';
import '../styles/page.css';
import Search from './Search';
import RightBar from './RightBar';
import Tab from './Tab';
import { useEffect, useState } from 'react';
import useGrabTrends from '../useGrabTrends';
import useGrabAccounts from '../useGrabAccounts';
import LoadingIcon from '../assets/loading.svg';

export default function Explore() {
  const [currentTab, setCurrentTab] = useState('trending');
  const trendList = useGrabTrends(25);
  const accountList = useGrabAccounts(25);
  const [loading, setLoading] = useState(true);

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
    setLoading(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  });

  return (
    <>
      <div className="explorePage page">
        {loading ? (
          <div className="thickHeaderLoading loading">
            <img src={LoadingIcon} alt="" className="loadingIcon" />
          </div>
        ) : null}
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
            tabName={'Popular Accounts'}
            className={'popularAccounts'}
          />
          <div className={`indicator ${currentTab}`}></div>
        </header>
        {currentTab === 'trending' ? trendList : null}
        {currentTab === 'popularAccounts' ? accountList : null}
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

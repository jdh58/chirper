import { useState } from 'react';
import '../styles/page.css';
import '../styles/SearchPage.css';
import Search from './Search';
import Tab from './Tab';
import RightBar from './RightBar';

export default function SearchPage() {
  const [currentTab, setCurrentTab] = useState('top');

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="searchPage page">
        <div className="explorePage page">
          <header>
            <Search />
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
        </div>
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

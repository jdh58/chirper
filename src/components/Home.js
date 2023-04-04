import { useContext, useState } from 'react';
import '../styles/Home.css';
import '../styles/page.css';
import Tab from './Tab';
import RightBar from './RightBar';
import ChirpModule from './ChirpModule';
import Chirp from './Chirp';
import UserContext from '../UserContext';

export default function Home({ overlay, displayToast }) {
  const user = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('foryou');

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
        <ChirpModule isReply={false} displayToast={displayToast} />
      </div>
      <RightBar />
    </>
  );
}

import { useState } from 'react';
import '../styles/Home.css';
import Nav from './Nav';
import WhatsHappening from './RightBar';
import TweepModule from './TweepModule';
import Tweep from './Tweep';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('foryou');

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  return (
    <>
      <div className="homePage">
        <header>
          <h1 className="title">Home</h1>
          <div
            className="foryou subheader"
            onClick={setTab}
            style={
              currentTab === 'foryou'
                ? { opacity: '1', fontWeight: 700 }
                : { opacity: '70%', fontWeight: 600 }
            }
          >
            <h2>For you</h2>
          </div>
          <div
            className="following subheader"
            onClick={setTab}
            style={
              currentTab === 'following'
                ? { opacity: '1', fontWeight: 700 }
                : { opacity: '70%', fontWeight: 600 }
            }
          >
            <h2>Following</h2>
          </div>
          <div className={`indicator ${currentTab}`}></div>
        </header>
        <TweepModule />
        <Tweep />
        <Tweep />
        <Tweep />
        <Tweep />
        <Tweep />
        <Tweep />
        <Tweep />
        <Tweep />
      </div>
      <WhatsHappening />
    </>
  );
}

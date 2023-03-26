import { useState } from 'react';
import '../styles/Home.css';
import Nav from './Nav';
import WhatsHappening from './RightBar';
import TweepModule from './TweepModule';

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
              currentTab === 'foryou' ? { opacity: '1' } : { opacity: '70%' }
            }
          >
            <h2>For you</h2>
          </div>
          <div
            className="following subheader"
            onClick={setTab}
            style={
              currentTab === 'following' ? { opacity: '1' } : { opacity: '70%' }
            }
          >
            <h2>Following</h2>
          </div>
          <div className={`indicator ${currentTab}`}></div>
        </header>
        <TweepModule />
      </div>
      <WhatsHappening />
    </>
  );
}

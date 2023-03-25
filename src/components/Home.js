import { useState } from 'react';
import '../styles/Home.css';
import Nav from './Nav';
import WhatsHappening from './RightBar';

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
          <div className="foryou subheader" onClick={setTab}>
            <h2>For you</h2>
          </div>
          <div className="following subheader" onClick={setTab}>
            <h2>Following</h2>
          </div>
          <div className={`indicator ${currentTab}`}></div>
        </header>
      </div>
      <WhatsHappening />
    </>
  );
}

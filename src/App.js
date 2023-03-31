import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import Bookmarks from './components/Bookmarks';
import Notifications from './components/Notifications';
import Explore from './components/Explore';
import Home from './components/Home';
import Nav from './components/Nav';
import ChirpModule from './components/ChirpModule';
import SignUp from './components/SignUp';
import SignInBanner from './components/SignInBanner';
import Chirp from './components/Chirp';
import { useState } from 'react';
import Profile from './components/Profile';
import { app } from './firebase-config';

function App() {
  const [overlay, setOverlay] = useState(false);

  const chirpOverlay = () => {
    setOverlay('chirp');
    document.querySelector('body').style = 'overflow: hidden;';
  };

  return (
    <BrowserRouter>
      {overlay === 'chirp' ? (
        <ChirpModule
          overlay={true}
          killModule={() => {
            setOverlay(false);
            document.querySelector('body').style = 'overflow: auto;';
          }}
        />
      ) : null}

      <SignInBanner />
      <Nav chirpOverlay={chirpOverlay} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
        <Route path="/bookmarks" element={<Bookmarks />}></Route>
        <Route path="/profile/:id?" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

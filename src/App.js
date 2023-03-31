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
import FinishSignUp from './components/FinishSignUp';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import { app } from './firebase-config';

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    if (!!overlay) {
      document.querySelector('body').style = 'overflow: hidden;';
    } else {
      document.querySelector('body').style = 'overflow: auto;';
    }
  }, [overlay]);

  return (
    <BrowserRouter>
      {overlay === 'chirp' ? (
        <ChirpModule
          overlay={true}
          killModule={() => {
            setOverlay(false);
          }}
        />
      ) : null}
      {overlay === 'signIn' ? (
        <SignIn
          killModule={() => {
            setOverlay(false);
          }}
          toSignUp={() => {
            setOverlay('signUp');
          }}
        />
      ) : null}
      {overlay === 'signUp' ? (
        <FinishSignUp
          killModule={() => {
            setOverlay(false);
          }}
          toSignIn={() => {
            setOverlay('signIn');
          }}
        />
      ) : null}

      {!signedIn ? (
        <SignInBanner
          onSignIn={() => {
            setOverlay('signIn');
          }}
          onSignUp={() => {
            setOverlay('signUp');
          }}
        />
      ) : null}

      <Nav
        chirpOverlay={() => {
          setOverlay('chirp');
        }}
      />
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

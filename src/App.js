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
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import existCheck from './existCheck';

function App() {
  const [signedIn, setSignedIn] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        setSignedIn(true);
        setUser(user);
        return;
      }
      setSignedIn(false);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    // Check if the account hasnt been created on Chirper, and force overlay
    if (!!user) {
      (async function () {
        const existingAccount = await existCheck(user.uid);
        if (existingAccount.length === 0) {
          setOverlay('finalize');
        }
      })();
    }
  }, [user]);

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
        <SignUp
          killModule={() => {
            setOverlay(false);
          }}
          toSignIn={() => {
            setOverlay('signIn');
          }}
          finalize={() => {
            setOverlay('finalize');
          }}
        />
      ) : null}
      {overlay === 'finalize' ? (
        <FinishSignUp
          killModule={() => {
            setOverlay(false);
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
        signedIn={signedIn}
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

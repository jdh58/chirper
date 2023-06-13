import './styles/App.css';
import './styles/loading.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import SignIn from './components/SignIn';
import BookmarkPage from './components/BookmarkPage';
import NotificationPage from './components/NotificationPage';
import Explore from './components/Explore';
import Home from './components/Home';
import Nav from './components/Nav';
import ChirpModule from './components/ChirpModule';
import SignUp from './components/SignUp';
import SignInBanner from './components/SignInBanner';
import FinishSignUp from './components/FinishSignUp';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import { app } from './firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import existCheck from './existCheck';
import UserContext from './UserContext';
import ToastNotification from './components/ToastNotification';
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import SearchPage from './components/SearchPage';
import ChirpPage from './components/ChirpPage';
import ToastContext from './ToastContext';
import FollowPage from './components/FollowPage';
import OverlayContext from './OverlayContext';

function App() {
  const [overlay, setOverlay] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [replyId, setReplyId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        setUser(user);
        return;
      }
      setUserInfo(null);
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
        } else {
          const accountDoc = await getDocs(
            query(
              collection(getFirestore(app), 'accounts'),
              where('userId', '==', `${user.uid}`)
            )
          );
          console.log('get account for user context');

          let account = accountDoc.docs[0];

          onSnapshot(account.ref, (account) => {
            setUserInfo(account.data());
          });
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

  const displayToast = (message) => {
    const timeAlive = 3000;
    setToast(<ToastNotification message={message} timeAlive={timeAlive} />);

    setTimeout(() => {
      setToast(null);
    }, timeAlive);
  };

  const overlayFunction = (value, replyId) => {
    if (replyId) {
      setReplyId(replyId.toString());
    }
    setOverlay(value);
  };

  return (
    <HashRouter>
      <UserContext.Provider value={userInfo}>
        <ToastContext.Provider value={displayToast}>
          <OverlayContext.Provider value={overlayFunction}>
            {toast}
            {overlay === 'reply' ? (
              <ChirpModule
                overlay={true}
                killModule={() => {
                  setOverlay(false);
                }}
                replyTo={replyId}
                isReply={true}
              />
            ) : null}
            {overlay === 'chirp' ? (
              <ChirpModule
                overlay={true}
                killModule={() => {
                  setOverlay(false);
                }}
                isReply={false}
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

            {!user ? (
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
              <Route path="/chirp/:id" element={<ChirpPage />}></Route>
              <Route path="/search/:query" element={<SearchPage />}></Route>
              <Route path="/explore" element={<Explore />}></Route>
              <Route
                path="/notifications"
                element={<NotificationPage />}
              ></Route>
              <Route path="/bookmarks" element={<BookmarkPage />}></Route>
              <Route path="/profile/:id?" element={<Profile />}></Route>
              <Route
                path="/profile/:id?/:type"
                element={<FollowPage />}
              ></Route>
              <Route
                path="/profile/:id?/:type"
                element={<FollowPage />}
              ></Route>
            </Routes>
          </OverlayContext.Provider>
        </ToastContext.Provider>
      </UserContext.Provider>
    </HashRouter>
  );
}

export default App;

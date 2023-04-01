import Logo from '../assets/logo.svg';
import Home from '../assets/home.svg';
import HomeFill from '../assets/home_fill.svg';
import Tag from '../assets/tag.svg';
import TagFill from '../assets/tag_fill.svg';
import Notifications from '../assets/notifications.svg';
import NotificationsFill from '../assets/notifications_fill.svg';
import Messages from '../assets/messages.svg';
import MessagesFill from '../assets/messages_fill.svg';
import Bookmarks from '../assets/bookmark.svg';
import BookmarksFill from '../assets/bookmark_fill.svg';
import Profile from '../assets/profile.svg';
import ProfileFill from '../assets/profile_fill.svg';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import NavChirpButton from './NavChirpButton';
import '../styles/Nav.css';
import { app } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import existCheck from '../existCheck';

export default function Nav({ chirpOverlay }) {
  const [user, setUser] = useState(null);
  let location = useLocation();
  location = location.pathname;

  useEffect(() => {
    onAuthStateChanged(getAuth(app), (user) => {
      setUser(user);
    });
  }, []);

  if (location === '/signin' || location === '/signup') {
    // We don't want nav to render on the sign in page.
    return;
  }

  return (
    <nav className="navBar">
      <img src={Logo} alt="" className="logo" />
      <NavItem name="Home" emptyIcon={Home} fillIcon={HomeFill} />
      <NavItem name="Explore" emptyIcon={Tag} fillIcon={TagFill} />
      <NavItem
        name="Notifications"
        emptyIcon={Notifications}
        fillIcon={NotificationsFill}
      />
      <NavItem name="Messages" emptyIcon={Messages} fillIcon={MessagesFill} />
      <NavItem
        name="Bookmarks"
        emptyIcon={Bookmarks}
        fillIcon={BookmarksFill}
      />
      <NavItem name="Profile" emptyIcon={Profile} fillIcon={ProfileFill} />
      <NavChirpButton chirpOverlay={chirpOverlay} />

      {user ? (
        <button
          className="signOut"
          onClick={() => {
            signOut(getAuth(app));
          }}
        >
          Sign Out
        </button>
      ) : null}
    </nav>
  );
}

import Logo from '../assets/logo.svg';
import Home from '../assets/home.svg';
import HomeFill from '../assets/home_fill.svg';
import Tag from '../assets/tag.svg';
import TagFill from '../assets/tag_fill.svg';
import Notifications from '../assets/notifications.svg';
import NotificationsFill from '../assets/notifications_fill.svg';
import Messages from '../assets/messages.svg';
import MessagesFill from '../assets/messages_fill.svg';
import Bookmark from '../assets/bookmark.svg';
import BookmarkFill from '../assets/bookmark_fill.svg';
import Profile from '../assets/profile.svg';
import ProfileFill from '../assets/profile_fill.svg';
import '../styles/Nav.css';

export default function Nav() {
  return (
    <nav className="navBar">
      <img src={Logo} alt="" className="logo" />
      <div className="navButton">
        <img src={Home} alt="" className="navIcon" />
        <p className="navName">Home</p>
      </div>
      <div className="navButton">
        <img src={Tag} alt="" className="navIcon" />
        <p className="navName">Explore</p>
      </div>
      <div className="navButton">
        <img src={Notifications} alt="" className="navIcon" />
        <p className="navName">Notifications</p>
      </div>
      <div className="navButton">
        <img src={Messages} alt="" className="navIcon" />
        <p className="navName">Messages</p>
      </div>
      <div className="navButton">
        <img src={Bookmark} alt="" className="navIcon" />
        <p className="navName">Bookmarks</p>
      </div>
      <div className="navButton">
        <img src={Profile} alt="" className="navIcon" />
        <p className="navName">Profile</p>
      </div>
      <button className="tweepButton">Tweep</button>
    </nav>
  );
}

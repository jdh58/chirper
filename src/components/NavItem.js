import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../UserContext';

export default function NavItem({ name, emptyIcon, fillIcon }) {
  let location = useLocation();
  const user = useContext(UserContext);
  const empty = emptyIcon;
  const fill = fillIcon;
  location = location.pathname;

  let to = `/${name.toLowerCase()}`;

  // Handle case for default '/' path
  if (name === 'Home') {
    to = '/';
  }

  // Handle case for profile path
  if (name === 'Profile') {
    to = `/profile/${user.userId}`;
  }

  return (
    <Link to={to}>
      <div className={location === to ? 'navButton active' : 'navButton'}>
        <img src={location === to ? fill : empty} alt="" className="navIcon" />
        <p className="navName">{name}</p>
      </div>
    </Link>
  );
}

import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ name, emptyIcon, fillIcon }) {
  let location = useLocation();
  location = location.pathname;

  let to = `/${name.toLowerCase()}`;

  // Handle case for default '/' path
  if (name === 'Home') {
    to = '/';
  }

  return (
    <Link to={to}>
      <div className={location === to ? 'navButton active' : 'navButton'}>
        <img
          src={location === to ? fillIcon : emptyIcon}
          alt=""
          className="navIcon"
        />
        <p className="navName">{name}</p>
      </div>
    </Link>
  );
}

import Glass from '../assets/search.svg';
import '../styles/Search.css';

export default function Search() {
  return (
    <div className="searchBar">
      <img src={Glass} alt="" />
      <p>Search Twitter</p>
    </div>
  );
}

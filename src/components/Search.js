import Glass from '../assets/search.svg';
import '../styles/Search.css';

export default function Search() {
  // TODO: Add logic to add 'X' clear button when input is there
  return (
    <form className="searchBar">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search Twitter"
      />
      <img src={Glass} alt="" />
    </form>
  );
}

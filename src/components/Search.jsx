import { useNavigate } from 'react-router-dom';
import Glass from '../assets/search.svg';
import '../styles/Search.css';

export default function Search({ defaultValue }) {
  const navigate = useNavigate();

  // TODO: Add logic to add 'X' clear button when input is there

  return (
    <form
      className="searchBar"
      onSubmit={() => {
        navigate(
          `/search/${encodeURIComponent(
            document.querySelector('#search').value
          )}`
        );
      }}
    >
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search Chirper"
        defaultValue={defaultValue}
      />
      <img src={Glass} alt="" />
    </form>
  );
}

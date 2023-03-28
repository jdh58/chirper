import '../styles/Explore.css';
import '../styles/page.css';
import Search from './Search.js';

export default function Explore() {
  return (
    <div className="explorePage page">
      <header>
        <Search />
      </header>
    </div>
  );
}

import '../styles/Explore.css';
import '../styles/page.css';
import Search from './Search.js';
import RightBar from './RightBar';

export default function Explore() {
  return (
    <>
      <div className="explorePage page">
        <header>
          <Search />
          <div className="trending">
            <h2>Trending</h2>
          </div>
          <div className="sports">
            <h2></h2>
          </div>
          <div className="trending">
            <h2>For you</h2>
          </div>
        </header>
      </div>
      <RightBar noSearch="true" />
    </>
  );
}

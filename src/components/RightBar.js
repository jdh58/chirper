import '../styles/RightBar.css';
import TrendItem from './TrendItem';
import Search from './Search';
import AccountModule from './AccountModule';

export default function RightBar({ noSearch }) {
  // TODO: Fill out copyright with my github and sites

  return (
    <div className="rightBar">
      {!noSearch ? (
        <>
          <Search />
          <div className="trends">
            <h2 className="title">What's happening</h2>
            <div className="whItems">
              <TrendItem />
              <TrendItem />
              <TrendItem />
              <TrendItem />
            </div>
          </div>
        </>
      ) : null}

      <div className={!noSearch ? 'accounts' : 'accounts only'}>
        <h2 className="title">Who to follow</h2>
        <div className="accountItems">
          <AccountModule />
          <AccountModule />
          <AccountModule />
        </div>
      </div>

      <div className="copyright">
        <a href="https://jonathanhawes.dev">My Website</a>
        <a href="https://github.com/jdh58">GitHub</a>
        <div className="forcewrap"></div>
        <p>© 2023 Nobody, Inc.</p>
      </div>
    </div>
  );
}

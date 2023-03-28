import '../styles/RightBar.css';
import TrendList from './TrendList';
import Search from './Search';
import AccountModule from './AccountModule';

export default function RightBar({ noSearch }) {
  return (
    <div className="rightBar">
      {!noSearch ? (
        <>
          <Search />
          <div className="trends">
            <h2 className="title">What's happening</h2>
            <div className="whItems">
              <TrendList />
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
    </div>
  );
}

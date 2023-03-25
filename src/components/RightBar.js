import '../styles/RightBar.css';
import TrendList from './TrendList';
import Search from './Search';

export default function RightBar(props) {
  return (
    <div className="rightBar">
      {!props.isExplore ? <Search /> : null}

      <div className="trends">
        <h2 className="title">What's happening</h2>
        <div className="whItems">
          <TrendList />
        </div>
      </div>

      <div className="accounts">
        <h2 className="title">Who to follow</h2>
        <div className="whItems">
          <TrendList />
        </div>
      </div>
    </div>
  );
}

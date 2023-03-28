import '../styles/TrendItem.css';
import More from '../assets/more.svg';

export default function TrendItem() {
  return (
    <>
      <div className="trendItem">
        <div className="trendInfo">
          <p className="title">
            <p className="number">1</p>
            <div className="separator"></div>
            <p>Trending</p>
          </p>
          <h3 className="topic">76ers at Warriors</h3>
          <p className="number">7,324 Tweeps</p>
        </div>
        <img src={More} alt="" className="more" />
      </div>
    </>
  );
}

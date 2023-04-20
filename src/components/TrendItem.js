import '../styles/TrendItem.css';
import More from '../assets/more.svg';

export default function TrendItem({ number, name, count }) {
  return (
    <>
      <div className="trendItem">
        <div className="trendInfo">
          <span className="title">
            <p className="number">{number}</p>
            <div className="separator"></div>
            <p>Trending</p>
          </span>
          <h3 className="topic">{name}</h3>
          <p className="number">{count} Chirps</p>
        </div>
        <img src={More} alt="" className="more" />
      </div>
    </>
  );
}

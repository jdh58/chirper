import '../styles/TrendItem.css';
import More from '../assets/more.svg';
import { useNavigate } from 'react-router-dom';

export default function TrendItem({ number, name, count }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="trendItem"
        onClick={() => {
          navigate(`/search/${encodeURIComponent(`${name}`)}`);
        }}
      >
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

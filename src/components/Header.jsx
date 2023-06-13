import { useNavigate } from 'react-router-dom';
import Back from '../assets/back.svg';
import '../styles/Header.css';

export default function Header({ hasBack, top, bottom }) {
  const navigate = useNavigate();

  return (
    <header data-testid="header">
      {hasBack ? (
        <div
          className="backContainer"
          onClick={() => {
            navigate(-1);
          }}
          data-testid="back-container"
        >
          <img src={Back} alt="" className="backButton" />
        </div>
      ) : null}

      <div className="info">
        <p className="top">{top}</p>
        <p className="bottom">{bottom}</p>
      </div>
    </header>
  );
}

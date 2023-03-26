import '../styles/TweepButton.css';

export default function TweepButton({ disabled }) {
  return (
    <>
      {disabled ? (
        <button disabled className="tweepButton">
          Tweep
        </button>
      ) : (
        <button className="tweepButton">Tweep</button>
      )}
    </>
  );
}

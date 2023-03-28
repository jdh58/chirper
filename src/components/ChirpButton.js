import '../styles/ChirpButton.css';

export default function ChirpButton({ disabled }) {
  return (
    <>
      {disabled ? (
        <button disabled className="chirpButton">
          Chirp
        </button>
      ) : (
        <button className="chirpButton">Chirp</button>
      )}
    </>
  );
}

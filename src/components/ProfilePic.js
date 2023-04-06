export default function ProfilePic({ picURL, onClick, noOverlay }) {
  return (
    <div className="profilePicContainer" onClick={onClick}>
      <img src={picURL} alt="" />
      {noOverlay ? null : <div className="imageOverlay"></div>}
    </div>
  );
}

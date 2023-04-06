export default function ProfilePic({ picURL, onClick }) {
  return (
    <div className="profilePicContainer" onClick={onClick}>
      <img src={picURL} alt="" />
      <div className="imageOverlay"></div>
    </div>
  );
}

export default function ProfilePic({ picURL }) {
  return (
    <div className="profilePicContainer">
      <img src={picURL} alt="" />
      <div className="imageOverlay"></div>
    </div>
  );
}

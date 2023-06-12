import AddPic from '../assets/addPic.svg';

export default function ProfilePic({
  picURL,
  onClick,
  noOverlay,
  editMode,
  inputOnClick,
}) {
  return (
    <div
      className="profilePicContainer"
      onClick={onClick}
      data-testid="profile-pic"
    >
      {editMode ? (
        <>
          <input
            type="file"
            name="profilePicInput"
            id="profilePicInput"
            onChange={inputOnClick}
          />
          <img className="inputIcon" src={AddPic} alt="" />
        </>
      ) : null}
      <img src={picURL} alt="profile pic" className="profilePic" />
      {noOverlay ? null : <div className="imageOverlay"></div>}
    </div>
  );
}

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
      data-testid="profile-pic-container"
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
      <img
        src={picURL}
        alt="profile pic"
        className="profilePic"
        data-testid="profile-pic"
      />
      {noOverlay ? null : <div className="imageOverlay"></div>}
    </div>
  );
}

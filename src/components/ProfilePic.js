import Pic from '../assets/fakepic.jpeg';

export default function ProfilePic() {
  return (
    <div className="profilePicContainer">
      <img src={Pic} alt="" />
      <div className="imageOverlay"></div>
    </div>
  );
}

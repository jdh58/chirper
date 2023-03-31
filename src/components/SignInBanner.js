import '../styles/SignInBanner.css';

export default function SignInBanner() {
  return (
    <div className="signInBanner">
      <div className="text">
        <p className="top">Don't miss what's happening</p>
        <p className="bottom">People on Chirper are the first to know.</p>
      </div>
      <div className="buttons">
        <button className="logIn">Log in</button>
        <button className="signUp">Sign up</button>
      </div>
    </div>
  );
}

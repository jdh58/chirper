import '../styles/SignInBanner.css';

export default function SignInBanner({ onSignIn, onSignUp }) {
  return (
    <div className="signInBanner">
      <div className="text">
        <p className="top">Don't miss what's happening</p>
        <p className="bottom">People on Chirper are the first to know.</p>
      </div>
      <div className="buttons">
        <button className="logIn" onClick={onSignIn}>
          Log in
        </button>
        <button className="signUp" onClick={onSignUp}>
          Sign up
        </button>
      </div>
    </div>
  );
}

import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import Google from '../assets/google-original.svg';
import Apple from '../assets/apple-original.svg';
import Close from '../assets/close.svg';
import { useState } from 'react';
import { app } from '../firebase-config';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import existCheck from '../existCheck.js';

export default function SignIn({ killModule, toSignUp, finalize }) {
  const [userInput, setUserInput] = useState('');

  const handleGoogle = async () => {
    try {
      const google = new GoogleAuthProvider();
      await signInWithPopup(getAuth(app), google);
      const existingAccount = await existCheck(getAuth(app).currentUser.uid);
      console.log(getAuth(app));

      if (!!getAuth(app).currentUser && existingAccount.length === 0) {
        finalize();
      } else {
        killModule();
      }
    } catch (error) {
      console.error('Sign in Failed', error);
    }
  };

  const checkUserInput = (e) => {
    const inputVal = e.target.value;

    if (inputVal.length > 0) {
      setUserInput('active');
    } else {
      setUserInput('');
    }
  };

  return (
    <div className="signInOverlay">
      <div className="signInPopUp">
        <img src={Close} alt="close" className="close" onClick={killModule} />
        <img src={Logo} alt="logo" className="logo" />
        <h1 className="title">Sign in to Chirper</h1>
        <div className="otherSignIn">
          <button className="signInButton google" onClick={handleGoogle}>
            <img src={Google} alt="Google Logo" />
            <p>Sign in with Google</p>
          </button>
          <button className="signInButton apple">
            <img src={Apple} alt="" />
            <p>Sign in with Apple</p>
          </button>
        </div>
        <div className="separator">
          <p>or</p>
        </div>
        <input
          type="text"
          name="username"
          id="username"
          onChange={checkUserInput}
          data-testid="username-input"
        />
        <div className={`placeholder ${userInput}`}>Email or username</div>
        <div className="otherSignIn">
          <button className="next">Next</button>
          <button className="forgot">Forgot password?</button>
        </div>

        <h2>
          Don't have an account?{' '}
          <span className="signUpButton" onClick={toSignUp}>
            Sign Up
          </span>
          <br />
          <br />
          (only Google for now)
        </h2>
      </div>
    </div>
  );
}

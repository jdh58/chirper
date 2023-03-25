import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import Google from '../assets/google-original.svg';
import Apple from '../assets/apple-original.svg';
import Close from '../assets/close.svg';
import { useState } from 'react';

export default function SignIn() {
  const [userInput, setUserInput] = useState('');

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
        <img src={Close} alt="" className="close" />
        <img src={Logo} alt="" className="logo" />
        <h1 className="title">Sign in to Tweeper</h1>
        <div className="otherSignIn">
          <button className="signInButton google">
            <img src={Google} alt="" />
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
        />
        <div className={`placeholder ${userInput}`}>Email or username</div>
        <div className="otherSignIn">
          <button className="next">Next</button>
          <button className="forgot">Forgot password?</button>
        </div>

        <h2>
          Don't have an account? <span className="signUpButton">Sign Up</span>
        </h2>
      </div>
    </div>
  );
}

import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import Google from '../assets/google-original.svg';
import Apple from '../assets/apple-original.svg';
import Close from '../assets/close.svg';
import { useState } from 'react';

export default function SignUp() {
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
        <h1 className="title">Join Chirper Today</h1>
        <div className="otherSignIn">
          <button className="signInButton google">
            <img src={Google} alt="" />
            <p>Sign up with Google</p>
          </button>
          <button className="signInButton apple">
            <img src={Apple} alt="" />
            <p>Sign up with Apple</p>
          </button>
        </div>
        <div className="separator">
          <p>or</p>
        </div>
        <div className="otherSignIn">
          <button className="next">Create account</button>
        </div>
        <h2>
          Already have an account? <span className="signUpButton">Log In</span>
        </h2>
      </div>
    </div>
  );
}

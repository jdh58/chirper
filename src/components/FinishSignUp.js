import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import { useState } from 'react';
import { app } from '../firebase-config';

export default function FinishSignUp({ killModule, toSignUp }) {
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
      <div className="signInPopUp finish">
        <img src={Logo} alt="" className="logo" />
        <h1 className="title">What would you like to be called?</h1>
        <form action="">
          <input type="text" name="name" id="name" onChange={checkUserInput} />
          <div className={`placeholder namePlaceholder ${userInput}`}>Name</div>
          <input type="text" name="username" id="username" />
          <div className={`userPlaceholder`}>@</div>
          <button type="submit" className="next">
            Finish Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

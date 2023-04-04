import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import { useEffect, useState } from 'react';
import { app } from '../firebase-config';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function FinishSignUp({}) {
  const [userInput, setUserInput] = useState('');

  const checkUserInput = (e) => {
    const inputVal = e.target.value;

    if (inputVal.length > 0) {
      setUserInput('active');
    } else {
      setUserInput('');
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    try {
      const name = document.querySelector('.finish #name').value;
      const username = document.querySelector('.finish #username').value;
      const picNum = Math.ceil(Math.random() * 7);
      await addDoc(collection(getFirestore(app), 'accounts'), {
        name,
        username,
        picPath: `defaultPics/default${picNum}`,
        userId: `${getAuth(app).currentUser.uid}`,
      });
      // Refresh
      document.location.reload();
    } catch (error) {
      console.error('Could not add new user to database' + error);
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
          <button type="submit" className="next" onClick={signUp}>
            Finish Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

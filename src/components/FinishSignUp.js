import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import { useEffect, useState } from 'react';
import { app } from '../firebase-config';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import default1 from '../assets/defaultPics/default1.png';
import default2 from '../assets/defaultPics/default2.png';
import default3 from '../assets/defaultPics/default3.png';
import default4 from '../assets/defaultPics/default4.png';
import default5 from '../assets/defaultPics/default5.png';
import default6 from '../assets/defaultPics/default6.png';
import default7 from '../assets/defaultPics/default7.png';

export default function FinishSignUp({}) {
  const [userInput, setUserInput] = useState('');
  const defaultPics = [];

  useEffect(() => {
    defaultPics.push(
      ...[default1, default2, default3, default4, default5, default6, default7]
    );
  }, []);

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
    try {
      const name = document.querySelector('.finish #name').value;
      const username = document.querySelector('.finish #username').value;
      const pic = defaultPics[Math.floor(Math.random() * 7)];
      await addDoc(collection(getFirestore(app), 'accounts'), {
        name,
        username,
        pic,
        id: `${getAuth(app).currentUser.uid}`,
      });
    } catch {
      console.error('Could not add user to database');
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

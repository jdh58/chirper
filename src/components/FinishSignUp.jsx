import '../styles/SignIn.css';
import Logo from '../assets/logo.svg';
import { useState } from 'react';
import { app } from '../firebase-config';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function FinishSignUp() {
  const [userInput, setUserInput] = useState('');

  const checkUserInput = (e) => {
    const inputVal = e.target.value;

    if (inputVal.length > 0) {
      setUserInput('active');
    } else {
      setUserInput('');
    }
  };

  const autoGrow = (textBox) => {
    textBox.style.height = '54px';
    textBox.style.height = `${textBox.scrollHeight}px`;
  };

  const signUp = async (e) => {
    // Don't refresh and prevent double registration.
    e.preventDefault();
    try {
      const button = e.target.querySelector('button');
      button.disabled = true;
      const name = document.querySelector('.finish #name').value;
      const username = document.querySelector('.finish #username').value;
      const bio = document.querySelector('.finish #bio').value;
      const picNum = Math.ceil(Math.random() * 7);
      const joinDate = format(new Date(), 'MMMM yyyy');

      const usernameDocs = await getDocs(
        query(
          collection(getFirestore(app), 'accounts'),
          where('username', '==', `${username}`)
        )
      );

      console.log('get username for existcheck on signup');

      // Will consolidate these into one function later, too lazy right nows
      if (usernameDocs.docs.length > 0) {
        console.error(`Username already exists`);
        const usernameInput = document.querySelector(`.finish #username`);
        usernameInput.setCustomValidity(`Username already exists`);
        usernameInput.reportValidity();
        usernameInput.setCustomValidity('');

        // Let user try again
        button.disabled = false;
        return false;
      }

      const picURL = await getDownloadURL(
        ref(getStorage(app), `defaultPics/default${picNum}.png`)
      );

      await addDoc(collection(getFirestore(app), 'accounts'), {
        name,
        username,
        bio,
        joinDate,
        picURL,
        userId: `${getAuth(app).currentUser.uid}`,
        following: [],
        followers: [],
        chirps: 0,
        likes: [],
        reChirps: [],
        bookmarks: [],
        bannerURL: '',
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
        <h1 className="title">Your account - tailored to you.</h1>
        <form action="" onSubmit={signUp}>
          <input
            required
            type="text"
            name="name"
            id="name"
            onChange={checkUserInput}
            minLength={3}
            maxLength={25}
            data-testid="name"
          />
          <div className={`placeholder namePlaceholder ${userInput}`}>Name</div>
          <input
            required
            type="text"
            name="username"
            id="username"
            minLength={3}
            maxLength={15}
            data-testid="username"
          />
          <div className={`userPlaceholder`}>@</div>
          <textarea
            required
            name="bio"
            id="bio"
            onChange={(e) => {
              autoGrow(e.target);
            }}
            placeholder="A bit about yourself"
            minLength="10"
            maxLength="160"
            data-testid="bio"
          />
          <button type="submit" className="next">
            Finish Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

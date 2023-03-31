// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAie2GvmCO2cbCgWlrukk7rg_OWcQlQjW4',
  authDomain: 'chirper-23662.firebaseapp.com',
  projectId: 'chirper-23662',
  storageBucket: 'chirper-23662.appspot.com',
  messagingSenderId: '500956212607',
  appId: '1:500956212607:web:1604d5ae2fb4946084fe4a',
  measurementId: 'G-LLF1W2HL9L',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };

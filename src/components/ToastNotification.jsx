import { useState } from 'react';
import { useEffect } from 'react';
import '../styles/ToastNotification.css';

export default function ToastNotification({ message, timeAlive }) {
  const [classes, setClasses] = useState('toastNotification');

  /* This useEffect adds the disappear class to trigger the 
  animation 400ms before the notification gets de-rendered */
  useEffect(() => {
    setTimeout(() => {
      setClasses('toastNotification disappear');
    }, timeAlive - 400);
  }, [timeAlive]);

  return <div className={classes}>{message}</div>;
}

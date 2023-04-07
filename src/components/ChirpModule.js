import Pic from '../assets/fakepic.jpeg';
import ChirpButton from './ChirpButton';
import GifBox from '../assets/gifbox.svg';
import ImageIcon from '../assets/image.svg';
import Poll from '../assets/list.svg';
import Emoji from '../assets/smile.svg';
import Clock from '../assets/clock.svg';
import Pin from '../assets/map-pin.svg';
import Close from '../assets/close.svg';
import '../styles/ChirpModule.css';
import { useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';
import { upload } from '@testing-library/user-event/dist/upload';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { format } from 'date-fns';
import UserContext from '../UserContext';

export default function ChirpModule({
  overlay,
  killModule,
  isReply,
  displayToast,
}) {
  const user = useContext(UserContext);

  const [characters, setCharacters] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDisplay, setImageDisplay] = useState(null);

  useEffect(() => {
    if (!uploadedImage) {
      setImageDisplay(null);
      return;
    }

    const fileURL = URL.createObjectURL(uploadedImage);

    setImageDisplay(
      <div className="uploadedImage">
        <div
          className="closeContainer"
          onClick={() => {
            setUploadedImage(null);
          }}
        >
          <img src={Close} alt="" className="close" />
        </div>
        <img src={fileURL} alt="" className="thePic" />
      </div>
    );
  }, [uploadedImage]);

  // We don't want non-users chirping
  if (!getAuth(app).currentUser) {
    return null;
  }

  const autoGrow = (textBox) => {
    textBox.style.height = '54px';
    textBox.style.height = `${textBox.scrollHeight}px`;
  };

  const handleChirpChange = (textBox) => {
    if (!textBox.nodeName) {
      textBox = textBox.target;
    }

    // Make sure the box size changes dynamically if it's not an overlay
    if (!overlay) {
      autoGrow(textBox);
    }

    // Disable the button if there's no text, otherwise enable it.
    if (textBox.value.length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    // Update character count
    setCharacters(textBox.value.length);
  };

  const handleImageAdded = (e) => {
    const file = e.target.files[0];

    if (!/image\/*/.test(file.type)) {
      console.error('Incorrect file type. Images only.');
      setUploadedImage(null);
      return;
    }
    if (file.size > 2000000) {
      // Pop up a toast notification letting the user know and log to console.
      console.error('File size too large (Max size 2 MB)');
      setUploadedImage(null);
      return;
    }

    setUploadedImage(file);
  };

  const handleSendChirp = async (e) => {
    try {
      // We go up from the button to ensure we grab the corresponding input
      const chirpModule = e.target.parentElement.parentElement;
      const textBox = chirpModule.querySelector('#chirpInput');
      const text = textBox.value;
      const accountId = getAuth(app).currentUser.uid;
      let chirpId = null;

      /* Clear box + image once value is saved, and let the module know to 
      update. This also disables the button so the user can't double Chirp.
      If it is an overaly chirp, close the overlay as well. */
      textBox.value = '';
      setUploadedImage(null);
      handleChirpChange(textBox);
      if (overlay) {
        killModule();
      }

      // Generate a random number from 1 to 100 trillion and check if the id already exists.
      let repeat = true;
      while (repeat === true) {
        chirpId = Math.floor(Math.random() * 100000000000000);
        const existing = await getDocs(
          query(
            collection(getFirestore(app), 'chirps'),
            where('chirpId', '==', `${chirpId}`)
          )
        ).docs;

        if (!existing) {
          repeat = false;
        }
      }

      // If there was an image, store it. Otherwise, set to null
      let imageURL = null;
      let storageURL = null;
      if (uploadedImage) {
        const imagePath = `${accountId}/${chirpId}`;
        const newImageRef = ref(getStorage(app), imagePath);
        const fileSnapshot = await uploadBytesResumable(
          newImageRef,
          uploadedImage
        );
        imageURL = await getDownloadURL(newImageRef);
        storageURL = fileSnapshot.metadata.fullPath;
      }

      // Log the chirp to the database
      await addDoc(collection(getFirestore(app), 'chirps'), {
        accountId,
        chirpId,
        text,
        imageURL,
        storageURL,
        isReply,
        replies: 0,
        reChirps: 0,
        likes: 0,
        postTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      });

      // Now we need to update the account's chirp count.
      let accountDoc = await getDocs(
        query(
          collection(getFirestore(app), 'accounts'),
          where('userId', '==', `${accountId}`)
        )
      );

      accountDoc = accountDoc.docs[0];
      const accountChirps = accountDoc.data().chirps + 1;
      const accountRef = accountDoc.ref;

      await updateDoc(accountRef, {
        chirps: accountChirps,
      });

      // Done. Whew.

      // Display a notification to let the user know a reply or chirp was sent
      isReply
        ? displayToast('Your reply was sent.')
        : displayToast('Your Chirp was sent.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={
        overlay ? 'chirpModuleContainer overlay' : 'chirpModuleContainer'
      }
    >
      <div className="chirpModule">
        {overlay ? (
          <img src={Close} alt="" className="close" onClick={killModule} />
        ) : null}
        <div className="chirpWriting">
          <img src={user ? user.picURL : null} alt="" className="profilePic" />
          <textarea
            name="chirpInput"
            id="chirpInput"
            placeholder={isReply ? 'Chirp your reply' : "What's happening?"}
            onChange={handleChirpChange}
            maxLength="280"
          />
          {imageDisplay}
        </div>
        <div className="toolbar">
          <div className="icons">
            <span className="iconContainer">
              <input
                type="file"
                name="imageInput"
                id="imageInput"
                onInput={handleImageAdded}
              />
              <img src={ImageIcon} alt="" className="icon" />
            </span>
            <span className="iconContainer">
              <img src={GifBox} alt="" className="icon gif" />
            </span>
          </div>
          <p
            className="characterCount"
            style={characters > 270 ? { color: 'red' } : null}
          >
            {characters > 0 ? `${characters}/280` : null}
          </p>
          <ChirpButton
            disabled={disabled}
            isReply={isReply}
            handleSendChirp={handleSendChirp}
          />
        </div>
      </div>
    </div>
  );
}

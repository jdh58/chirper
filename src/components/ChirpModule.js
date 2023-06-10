import ChirpButton from './ChirpButton';
import GifBox from '../assets/gifbox.svg';
import ImageIcon from '../assets/image.svg';
import Close from '../assets/close.svg';
import '../styles/ChirpModule.css';
import { useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config';
import {
  addDoc,
  arrayUnion,
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
import ToastContext from '../ToastContext';
import getAccount from '../getAccount';
import getChirp from '../getChirp';

export default function ChirpModule({ overlay, killModule, isReply, replyTo }) {
  const user = useContext(UserContext);

  const [characters, setCharacters] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDisplay, setImageDisplay] = useState(null);
  const displayToast = useContext(ToastContext);

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

  const autoGrow = (textBox, copyTextBox) => {
    textBox.style.height = '54px';
    textBox.style.height = `${textBox.scrollHeight}px`;
    copyTextBox.style.height = '54px';
    copyTextBox.style.height = `${copyTextBox.scrollHeight}px`;
  };

  const handleChirpChange = (textBox) => {
    if (!textBox.nodeName) {
      textBox = textBox.target;
    }

    // Set text copy equal to new input
    const copyTextBox = textBox.parentElement.querySelector('#chirpInput.copy');
    copyTextBox.textContent = textBox.textContent;

    // Make sure the box size changes dynamically
    autoGrow(textBox, copyTextBox);

    // Disable the button if there's no text, otherwise enable it.
    if (textBox.textContent.length === 0 || textBox.textContent.length > 280) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    // Update character count
    setCharacters(textBox.textContent.length);

    // Find and highlight all of the @'s and #'s
    const regex = /[#@][a-zA-Z0-9]+/g;

    // Collect all the matches with thier indexes
    const matches = [];
    let match;
    while ((match = regex.exec(textBox.textContent)) !== null) {
      matches.push(match);
    }

    /* For each tag, start at the end of the string, then insert
    all of the plain text before it as a <p>, and add a <span> 
    for the hashtag. If it's the last hashtag, add the rest as a <p>. */
    if (matches.length > 0) {
      copyTextBox.textContent = '';
      for (let i = 0; i < matches.length; i++) {
        let startPoint = copyTextBox.textContent.length;
        const hashtagStart = matches[i].index;

        const currentInput = textBox.textContent;
        copyTextBox.appendChild(document.createElement('p')).textContent =
          currentInput.slice(startPoint, hashtagStart);
        copyTextBox
          .appendChild(document.createElement('span'))
          .classList.add('hashtag');
        copyTextBox.querySelector('.hashtag:last-child').textContent =
          matches[i][0];

        if (!matches[i + 1]) {
          copyTextBox.appendChild(document.createElement('p')).textContent =
            currentInput.slice(hashtagStart + matches[i][0].length);
        }
      }
    }
  };

  const handleImageAdded = (e) => {
    const file = e.target.files[0];

    if (!/image\/*/.test(file.type)) {
      console.error('Incorrect file type. Images only.');
      displayToast('Incorrect file type. Images only.');
      setUploadedImage(null);
      return;
    }
    if (file.size > 2000000) {
      // Pop up a toast notification letting the user know and log to console.
      console.error('File size too large (Max size 2 MB)');
      displayToast('File size too large (Max size 2 MB)');
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
      let text = textBox.textContent;
      const accountId = getAuth(app).currentUser.uid;
      let chirpId = null;

      // Remove excessive newlines
      text = text.replace(/\n\n+/g, '\n\n');
      text = text.replace(/\n$/, '');
      text = text.replace(/^\n/, '');

      let wordArray = text.toLowerCase().split(' ');

      /* Clear box + image once value is saved, and let the module know to 
      update. This also disables the button so the user can't double Chirp.
      If it is an overaly chirp, close the overlay as well. */
      textBox.textContent = '';
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
        console.log('get chirp for checkchirpid');

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

      // If the user tagged anybody, save it so they can get notified
      const tagRegex = /@[a-zA-Z0-9]+/g;
      const tagArray = [];
      let tagMatch;

      while ((tagMatch = tagRegex.exec(text)) !== null) {
        tagArray.push(tagMatch[0]);
      }

      // If there is not reply, replyTo will be undefined, so set it to null
      if (!replyTo) {
        replyTo = null;
      }

      let isMedia = false;
      if (imageURL != null) {
        isMedia = true;
      }

      // Log the chirp to the database
      await addDoc(collection(getFirestore(app), 'chirps'), {
        accountId,
        chirpId,
        text,
        imageURL,
        storageURL,
        isMedia,
        isReply,
        replyTo,
        wordArray,
        replies: [],
        reChirps: [],
        likes: [],
        likeCount: 0,
        tags: tagArray,
        postTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      });

      // If the user had any hashtags, update the database.
      const hashRegex = /#[a-zA-Z0-9]+/g;
      const hashArray = [];
      let hashMatch;

      while ((hashMatch = hashRegex.exec(text)) !== null) {
        hashArray.push(hashMatch[0]);
      }

      if (hashArray.length > 0) {
        hashArray.forEach(async (hashtag) => {
          // Try to grab the doc for the hashtag
          const hashtagDoc = await getDocs(
            query(
              collection(getFirestore(app), 'hashtags'),
              where('name', '==', `${hashtag}`)
            )
          );
          console.log('get hashtag for checkhashtag');

          if (!!hashtagDoc.docs[0]) {
            // If the hashtag has been seen before, iterate the count by 1.
            const hashtagCount = hashtagDoc.docs[0].data().count;
            const hashtagRef = hashtagDoc.docs[0].ref;

            await updateDoc(hashtagRef, {
              count: hashtagCount + 1,
            });
          } else {
            /* If the hahtag has never been sent before, add a doc 
            for it with initial count of 1. */
            await addDoc(collection(getFirestore(app), 'hashtags'), {
              name: hashtag,
              count: 1,
            });
          }
        });
      }

      // If the chirp being sent is a reply, add it to the reply array for the chirp it replied to
      if (isReply) {
        const repliedToChirp = await getChirp(parseInt(replyTo));

        updateDoc(repliedToChirp.ref, {
          replies: arrayUnion(chirpId),
        });
      }

      // Now we need to update the account's chirp count.
      const accountDoc = await getAccount(accountId);

      const accountChirps = accountDoc.data().chirps + 1;

      await updateDoc(accountDoc.ref, {
        chirps: accountChirps,
      });

      // Done. Whew.

      // Display a notification to let the user know a reply or chirp was sent
      isReply
        ? displayToast('Your reply was sent.')
        : displayToast('Your Chirp was sent.');
    } catch (err) {
      console.error(err);
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
          <div className="inputContainer">
            <span
              className="textarea invis"
              contentEditable="true"
              name="chirpInput"
              id="chirpInput"
              data-placeholder={
                isReply ? 'Chirp your reply' : "What's happening?"
              }
              onInput={handleChirpChange}
              onPaste={(e) => {
                e.preventDefault();
              }}
            ></span>
            <span
              className="textarea copy"
              name="chirpInput"
              id="chirpInput"
            ></span>
          </div>
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

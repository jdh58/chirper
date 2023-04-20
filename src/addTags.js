import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from './firebase-config';

export default function addTags(text, navigate, displayToast) {
  const handleTagClick = async (e) => {
    if (e.target.textContent.startsWith('#')) {
      navigate(`/search/${e.target.textContent.slice(1)}`);
    }
    if (e.target.textContent.startsWith('@')) {
      try {
        const accountDoc = await getDocs(
          query(
            collection(getFirestore(app), 'accounts'),
            where('username', '==', `${e.target.textContent.slice(1)}`)
          )
        );

        navigate(`/profile/${accountDoc.docs[0].data().userId}`);
      } catch (error) {
        displayToast('Account does not exist.');
        console.error('Could not go to account.', error);
      }
    }
  };

  // Find and highlight all of the @'s and #'s
  const regex = /[#@][a-zA-Z0-9]+/g;

  // Collect all the matches with thier indexes
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }

  const dataArray = [];

  /* For each tag, start at the end of the string, then insert
 all of the plain text before it as a <p>, and add a <span> 
 for the hashtag. If it's the last hashtag, add the rest as a <p>. */
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      let startPoint = 0;
      dataArray.forEach((element) => {
        startPoint += element.textContent.length;
      });
      const hashtagStart = matches[i].index;

      const currentInput = text;
      dataArray.push({
        className: 'normalText',
        textContent: currentInput.slice(startPoint, hashtagStart),
      });
      dataArray.push({
        className: 'hashtag',
        textContent: matches[i][0],
      });

      if (!matches[i + 1]) {
        dataArray.push({
          className: 'normalText',
          textContent: currentInput.slice(hashtagStart + matches[i][0].length),
        });
      }
    }
  } else {
    dataArray.push({
      className: 'normalText',
      textContent: text,
    });
  }

  return dataArray.map((element) => {
    return (
      <span onClick={handleTagClick} className={element.className}>
        {element.textContent}
      </span>
    );
  });
}

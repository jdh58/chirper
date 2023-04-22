import RightBar from './RightBar';
import Calendar from '../assets/calendar.svg';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import Tab from './Tab';
import '../styles/page.css';
import '../styles/Profile.css';
import { useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import existCheck from '../existCheck';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import UserContext from '../UserContext';
import FollowButton from './FollowButton';
import InfoSection from './InfoSection';
import ToastContext from '../ToastContext';
import getAccount from '../getAccount';
import AddPic from '../assets/addPic.svg';
import getChirp from '../getChirp';
import Header from './Header';
import InfiniteScroll from 'react-infinite-scroll-component';
import grabForInfinite from '../grabForInfinite';

export default function Profile() {
  const urlId = useParams().id;
  const user = useContext(UserContext);
  const [isUser, setIsUser] = useState(false);
  const [currentTab, setCurrentTab] = useState('chirps');
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    following: '',
    followers: '',
    likes: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [chirps, setChirps] = useState([]);
  const [replies, setReplies] = useState([]);
  const [media, setMedia] = useState([]);
  const [likes, setLikes] = useState([]);
  const [finalChirp, setFinalChirp] = useState(null);
  const [finalReply, setFinalReply] = useState(null);
  const [finalMedia, setFinalMedia] = useState(null);
  const [finalLike, setFinalLike] = useState(0);
  const [chirpPage, setChirpPage] = useState(0);
  const [replyPage, setReplyPage] = useState(0);
  const [mediaPage, setMediaPage] = useState(0);
  const [likesPage, setLikesPage] = useState(0);
  const displayToast = useContext(ToastContext);

  useEffect(() => {
    setEditMode(false);
    setCurrentTab('chirps');

    (async () => {
      const profileDocs = await existCheck(urlId);
      if (!profileDocs) {
        return;
      }
      setProfile(profileDocs[0].data());
    })();
  }, [urlId]);

  useEffect(() => {
    if (user) {
      if (urlId === user.userId) {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    }
  }, [urlId, user]);

  useEffect(() => {
    if (profile) {
      if (currentTab === 'chirps') {
        grabChirps(true);
      } else if (currentTab === 'replies') {
        grabReplies(true);
      } else if (currentTab === 'media') {
        grabMedia(true);
      } else if (currentTab === 'likes') {
        grabLikes();
      }
    }
  }, [currentTab, profile]);

  const grabLikes = async () => {
    const newLikes = [];

    console.log(profile.likes.length);
    for (let i = 0; i < 10 && i + finalLike < profile.likes.length; i++) {
      console.log(i);
      let likedChirpDoc = await getChirp(profile.likes[i + finalLike]);
      let likedChirpData = likedChirpDoc.data();

      newLikes.push(
        <Chirp chirpData={likedChirpData} key={profile.likes[i]} />
      );
    }

    setFinalLike((finalLike) => finalLike + 10);
    setLikes([...likes, ...newLikes]);
    setLikesPage((likesPage) => likesPage + 1);
  };

  const grabChirps = async (first) => {
    let grabQuery;
    if (first) {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        orderBy('postTime', 'desc'),
        limit(10)
      );
    } else {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        orderBy('postTime', 'desc'),
        startAfter(finalChirp),
        limit(10)
      );
    }

    const chirpGrab = await grabForInfinite(grabQuery);

    setFinalChirp(chirpGrab.finalChirp);
    setChirps([...chirps, ...chirpGrab.newChirps]);
    setChirpPage((chirpPage) => chirpPage + 1);
  };

  const grabReplies = async (first) => {
    let grabQuery;

    if (first) {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        where('isReply', '!=', false),
        limit(10)
      );
    } else {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        where('isReply', '!=', false),
        startAfter(finalReply),
        limit(10)
      );
    }

    const replyGrab = await grabForInfinite(grabQuery);

    setFinalReply(replyGrab.finalChirp);
    setReplies([...replies, ...replyGrab.newChirps]);
    setReplyPage((replyPage) => replyPage + 1);
  };

  const grabMedia = async (first) => {
    let grabQuery;

    if (first) {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        where('imageURL', '!=', null),
        limit(10)
      );
    } else {
      grabQuery = query(
        collection(getFirestore(app), 'chirps'),
        where('accountId', '==', `${profile.userId}`),
        where('imageURL', '!=', null),
        startAfter(finalMedia),
        limit(10)
      );
    }
    const mediaGrab = await grabForInfinite(grabQuery);

    setFinalMedia(mediaGrab.finalChirp);
    setMedia([...media, ...mediaGrab.newChirps]);
    setMediaPage((mediaPage) => mediaPage + 1);
  };

  const setTab = (e) => {
    setCurrentTab(e.currentTarget.classList[0]);
  };

  const handleUpdateProfile = async () => {
    const form = document.querySelector('.profileInfo form');
    const newName = form.querySelector('input.name').value;
    const newUsername = form.querySelector('input.at').value;
    const newBio = form.querySelector('textarea#bio').value;

    // Go back to the normal view
    setEditMode(false);

    // If changed, check if the new username already exists
    if (newUsername !== user.username) {
      let isExistingUsername = await getDocs(
        query(
          collection(getFirestore(app), 'accounts'),
          where('username', '==', newUsername)
        )
      );
      console.log('get chirp for profileupdate');

      isExistingUsername = isExistingUsername.docs[0];

      if (isExistingUsername) {
        console.error(`Can not update profile: Username already exists`);
        displayToast(`Can not update profile: Username already exists`);
        return;
      }
    }

    const accountDoc = await getAccount(profile.userId);

    await updateDoc(accountDoc.ref, {
      name: newName,
      username: newUsername,
      bio: newBio,
    });

    const newAccountDoc = await getAccount(profile.userId);

    setProfile(newAccountDoc.data());

    // Display notification letting user know their profile has been updated
    displayToast('Your profile has been updated');
  };

  const handleProfilePicAdded = async (e) => {
    try {
      const file = e.target.files[0];

      checkValidImage(file);

      /* Now store the profile pic (overwrites if existing) */
      const newProfilePicPath = `profilePics/${user.userId}`;
      const newProfilePicRef = ref(getStorage(app), newProfilePicPath);
      const newProfilePicSnapshot = await uploadBytesResumable(
        newProfilePicRef,
        file
      );

      const newProfilePicURL = await getDownloadURL(newProfilePicRef);
      const newProfilePicStorageURL = newProfilePicSnapshot.metadata.fullPath;

      // Now update the profile
      const userDoc = await getAccount(user.userId);

      updateDoc(userDoc.ref, {
        picURL: newProfilePicURL,
        picStorageURL: newProfilePicStorageURL,
      });

      // Alert the user it was successful
      displayToast('Your profile picture has been updated');
    } catch (error) {
      console.error('Failed to update profile picture.', error);
      displayToast('Failed to update profile picture');
    }
  };

  const handleBannerUpload = async (e) => {
    try {
      const file = e.target.files[0];

      checkValidImage(file);

      /* Now store the profile pic (overwrites if existing) */
      const newBannerPath = `banners/${user.userId}`;
      const newBannerRef = ref(getStorage(app), newBannerPath);
      const newBannerSnapshot = await uploadBytesResumable(newBannerRef, file);

      const newBannerURL = await getDownloadURL(newBannerRef);
      const newBannerStorageURL = newBannerSnapshot.metadata.fullPath;

      // Now update the profile
      const userDoc = await getAccount(user.userId);

      updateDoc(userDoc.ref, {
        bannerURL: newBannerURL,
        bannerStorageURL: newBannerStorageURL,
      });

      // Alert the user it was successful
      displayToast('Your banner has been updated');
    } catch (error) {
      console.error('Could not upload banner', error);
      displayToast('Could not upload banner.');
    }
  };

  const checkValidImage = (file) => {
    if (!/image\/*/.test(file.type)) {
      console.error('Incorrect file type. Images only.');
      displayToast('Incorrect file type. Images only.');
      return;
    }
    if (file.size > 2000000) {
      // Pop up a toast notification letting the user know and log to console.
      console.error('File size too large (Max size 2 MB)');
      displayToast('File size too large (Max size 2 MB)');
      return;
    }
  };

  return (
    <>
      <div className="profilePage page">
        <Header
          hasBack={true}
          top={profile.name}
          bottom={`${profile.chirps} Chirps`}
        />
        <div className="banner">
          {editMode ? (
            <div className="bannerInputContainer">
              <input
                type="file"
                name="bannerInput"
                id="bannerInput"
                onChange={handleBannerUpload}
              />
              <img className="inputIcon" src={AddPic} alt="" />
              <img src={profile.bannerURL} alt="" className="bannerImage" />
              <div className="imageOverlay"></div>
            </div>
          ) : profile.bannerURL ? (
            <img src={profile.bannerURL} alt="" className="bannerImage" />
          ) : null}
        </div>
        <div className="profileInfo">
          <ProfilePic
            picURL={profile.picURL}
            editMode={editMode}
            inputOnClick={handleProfilePicAdded}
          />
          {editMode ? (
            <>
              <div
                className="finalizeButton profileButton"
                onClick={handleUpdateProfile}
              >
                Update
              </div>
              <div
                className="editButton profileButton"
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Discard
              </div>
            </>
          ) : isUser ? (
            <div
              className="editButton profileButton"
              onClick={() => {
                setEditMode(true);
              }}
            >
              Edit profile
            </div>
          ) : (
            <FollowButton clickedUser={profile} isProfile={true} />
          )}
          {editMode ? (
            <InfoSection profile={profile} editMode={editMode} />
          ) : (
            <InfoSection profile={profile} />
          )}
          <div className="joinDate">
            <img src={Calendar} alt="" />
            <p>Joined {profile.joinDate}</p>
          </div>

          <div className="followStats">
            <Link to={`/profile/${urlId}/following`} className="following">
              <span className="number">{profile.following.length || 0}</span>{' '}
              Following
            </Link>
            <Link to={`/profile/${urlId}/followers`} className="followers">
              <span className="number">{profile.followers.length || 0}</span>{' '}
              Followers
            </Link>
          </div>
        </div>
        <div className="tabs">
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Chirps'}
            className={'chirps'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Replies'}
            className={'replies'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Media'}
            className={'media'}
          />
          <Tab
            currentTab={currentTab}
            setTab={setTab}
            tabName={'Likes'}
            className={'likes'}
          />
          <div className={`indicator ${currentTab}`}></div>
        </div>
        {currentTab === 'chirps' ? (
          <InfiniteScroll
            dataLength={chirpPage * 10}
            next={grabChirps}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {chirps}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'replies' ? (
          <InfiniteScroll
            dataLength={replyPage * 10}
            next={grabReplies}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {replies}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'media' ? (
          <InfiniteScroll
            dataLength={mediaPage * 10}
            next={grabMedia}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {media}
          </InfiniteScroll>
        ) : null}
        {currentTab === 'likes' ? (
          <InfiniteScroll
            dataLength={likesPage * 10}
            next={grabLikes}
            hasMore={true}
            scrollThreshold={0.9}
          >
            {likes}
          </InfiniteScroll>
        ) : null}
      </div>
      <RightBar />
    </>
  );
}

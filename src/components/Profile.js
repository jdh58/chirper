import RightBar from './RightBar';
import Back from '../assets/back.svg';
import Calendar from '../assets/calendar.svg';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import Tab from './Tab';
import '../styles/page.css';
import '../styles/Profile.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import existCheck from '../existCheck';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
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

export default function Profile() {
  const urlId = useParams().id;
  const user = useContext(UserContext) || {
    userId: '',
  };
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(false);
  const [profileChirps, setProfileChirps] = useState(null);
  const [profileLikes, setProfileLikes] = useState(null);
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
  const displayToast = useContext(ToastContext);

  useEffect(() => {
    setEditMode(false);

    if (urlId === user.userId) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }

    (async () => {
      const profileDocs = await existCheck(urlId);
      if (!profileDocs) {
        return;
      }
      setProfile(profileDocs[0].data());
    })();
  }, [urlId, user]);

  useEffect(() => {
    (async () => {
      console.log(profile.likes);
      const likesList = await Promise.all(
        profile.likes.reverse().map(async (likedChirpId) => {
          const likedChirpDoc = await getChirp(likedChirpId);
          const likedChirpData = likedChirpDoc.data();
          return <Chirp chirpData={likedChirpData} key={likedChirpId} />;
        })
      );
      setProfileLikes(likesList);
    })();
  }, [profile]);

  useEffect(() => {
    /* Sort the tweets so newest render at the top, set state
   to be a mapped list of the user's chirps as chirp elements */
    (async () => {
      const chirpDocs = await getDocs(
        query(
          collection(getFirestore(app), 'chirps'),
          where('accountId', '==', `${profile.userId}`),
          orderBy('postTime', 'desc')
        )
      );

      const chirps = chirpDocs.docs;

      const chirpList = chirps.map((chirp) => {
        const chirpData = chirp.data();
        return (
          <Chirp
            chirpData={chirpData}
            profile={profile}
            key={chirpData.chirpId}
          />
        );
      });

      setProfileChirps(chirpList);
    })();
  }, [profile]);

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
      const newProfilePicPath = `profilePics/${profile.userId}`;
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
      const newBannerPath = `banners/${profile.userId}`;
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
        <header>
          <div
            className="backContainer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={Back} alt="" className="backButton" />
          </div>
          <div className="info">
            <p className="name">{profile.name}</p>
            <p className="chirps">{profile.chirps} Chirps</p>
          </div>
        </header>
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
          ) : (
            <img src={profile.bannerURL} alt="" className="bannerImage" />
          )}
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
        {currentTab === 'chirps' ? profileChirps : null}
        {currentTab === 'likes' ? profileLikes : null}
      </div>
      <RightBar />
    </>
  );
}

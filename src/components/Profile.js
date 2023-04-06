import RightBar from './RightBar';
import Back from '../assets/back.svg';
import Calendar from '../assets/calendar.svg';
import Chirp from './Chirp';
import ProfilePic from './ProfilePic';
import Tab from './Tab';
import '../styles/page.css';
import '../styles/Profile.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import existCheck from '../existCheck';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from '../firebase-config';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import UserContext from '../UserContext';
import FollowButton from './FollowButton';
import InfoSection from './InfoSection';

export default function Profile() {
  const urlId = useParams().id;
  const user = useContext(UserContext) || {
    userId: '',
  };
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(false);
  const [profileChirps, setProfileChirps] = useState(null);
  const [currentTab, setCurrentTab] = useState('chirps');
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    following: '',
    followers: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (urlId === user.userId) {
      setIsUser(true);
    }

    (async () => {
      const profileDocs = await existCheck(urlId);
      if (!profileDocs) {
        return;
      }
      const profileInfo = profileDocs[0].data();

      setProfile(profileInfo);
    })();
  }, [urlId, user]);

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
        return <Chirp chirpData={chirpData} profile={profile} />;
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

    // Go back to the normal
    setEditMode(false);

    const accountDoc = await getDocs(
      query(
        collection(getFirestore(app), 'accounts'),
        where('userId', '==', `${profile.userId}`)
      )
    );

    await updateDoc(accountDoc.docs[0].ref, {
      name: newName,
      username: newUsername,
      bio: newBio,
    });

    const newAccountDoc = await getDocs(
      query(
        collection(getFirestore(app), 'accounts'),
        where('userId', '==', `${profile.userId}`)
      )
    );

    setProfile(newAccountDoc.docs[0].data());

    // Display notification letting user know their profile has been updated
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
          <img src="" alt="" className="banner" />
        </div>
        <div className="profileInfo">
          <ProfilePic picURL={profile.picURL} />
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
            <FollowButton isProfile={true} />
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
            <p className="following">
              <span className="number">{profile.following}</span> Following
            </p>
            <p className="followers">
              <span className="number">{profile.followers}</span> Followers
            </p>
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
        {profileChirps}
      </div>
      <RightBar />
    </>
  );
}

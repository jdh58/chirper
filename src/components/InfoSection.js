import { useEffect } from 'react';
import Calendar from '../assets/calendar.svg';

export default function InfoSection({ profile, editMode }) {
  const autoGrow = (e) => {
    const textBox = e.target;

    textBox.style.height = '54px';
    textBox.style.height = `${textBox.scrollHeight}px`;
  };

  if (editMode) {
    return (
      <form>
        <div className="accountNames">
          <input
            className="name"
            defaultValue={profile.name}
            minLength="3"
            maxLength="25"
          />
          <div className="usernameInputContainer">
            <p>@</p>
            <input
              id="at"
              className="at"
              defaultValue={profile.username}
              minLength="3"
              maxLength="15"
            />
          </div>
        </div>
        <textarea
          className="bio"
          id="bio"
          onChange={autoGrow}
          defaultValue={profile.bio}
        />
      </form>
    );
  } else {
    return (
      <>
        <div className="accountNames">
          <h1 className="name">{profile.name}</h1>
          <h2 className="at">@{profile.username}</h2>
        </div>
        <p className="bio">{profile.bio}</p>
      </>
    );
  }
}

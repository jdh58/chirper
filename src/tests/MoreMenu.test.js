import { render, screen } from '@testing-library/react';
import MoreMenu from '../components/MoreMenu';
import UserContext from '../UserContext';
import '@testing-library/jest-dom';

describe('MoreMenu', () => {
  // This is dummy data that the Chirp component requires
  const chirpData = {
    chirpId: '123',
    accountId: '456',
    postTime: '2023-06-10T12:34:56.789Z',
    likes: [],
    reChirps: [],
    replies: [],
    text: 'This is a chirp',
    imageURL: 'examplepic',
  };

  const user = {
    userId: '789',
    bookmarks: [],
  };

  test("renders the MoreMenu component with delete option when it is the user's chirp", () => {
    // Make the user's userId equal to the Chirp's accountId
    user.userId = '456';

    render(
      <UserContext.Provider value={user}>
        <MoreMenu chirpData={chirpData} />
      </UserContext.Provider>
    );

    const bookmarkOption = screen.getByText('Bookmark');

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(bookmarkOption).toBeInTheDocument();
  });
});

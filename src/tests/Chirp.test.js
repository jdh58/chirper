import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Chirp from '../components/Chirp';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Chirp component', () => {
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

  const profile = {
    name: 'John Doe',
    username: 'johndoe',
    picURL: 'examplepic',
    userId: '456',
  };

  test('renders the Chirp component', () => {
    render(<Chirp chirpData={chirpData} profile={profile} />);

    // Assert that the component is rendered
    expect(screen.getByTestId('chirp')).toBeInTheDocument();
  });

  test('renders chirp information correctly', () => {
    // Wrap this in the Router so useNavigate() works
    render(<Chirp chirpData={chirpData} profile={profile} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('This is a chirp')).toBeInTheDocument();
    expect(screen.getByAltText('attachment')).toHaveAttribute(
      'src',
      'examplepic'
    );
  });

  test('navigates to profile page when clicking on the profile picture', () => {
    render(<Chirp chirpData={chirpData} profile={profile} />);

    const profilePicture = screen.getByTestId('profile-pic-container');

    userEvent.click(profilePicture);

    expect(mockedNavigate).toHaveBeenCalledWith('/profile/456');
  });

  test('navigates to chirp page when clicking on the chirp', () => {
    render(<Chirp chirpData={chirpData} profile={profile} />);
    const chirp = screen.getByTestId('chirp');

    act(() => {
      userEvent.click(chirp);
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/chirp/123');
  });

  test('displays MoreMenu when clicking on the More icon', () => {
    render(<Chirp chirpData={chirpData} profile={profile} />);

    const moreIcon = screen.getByTestId('more-container');

    act(() => {
      userEvent.click(moreIcon);
    });

    expect(screen.getByTestId('more-menu')).toBeInTheDocument();
  });

  test('hides MoreMenu when clicking outside of the chirp', () => {
    render(<Chirp chirpData={chirpData} profile={profile} />);
    const moreIcon = screen.getByTestId('more-container');

    act(() => {
      userEvent.click(moreIcon);
    });

    const clickDetector = screen.getByTestId('click-detector');

    act(() => {
      userEvent.click(clickDetector);
    });

    expect(screen.queryByTestId('more-menu')).toBeNull();
  });
});

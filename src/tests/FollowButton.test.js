import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowButton from '../components/FollowButton';
import UserContext from '../UserContext';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('Follow Button', () => {
  const mockClickedUser = {
    userId: '123',
    name: 'John Doe',
    username: 'johndoe',
    picURL: 'examplepic1',
    followers: [],
  };

  const mockProfile = {
    userId: '456',
    name: 'Mary Jane',
    username: 'maryjane',
    picURL: 'examplepic2',
    following: [],
  };

  test('renders without error', () => {
    render(<FollowButton clickedUser={mockClickedUser} />);

    expect(screen.getByTestId('follow-button')).toBeInTheDocument();
  });

  test('renders follow button correctly', () => {
    // Make sure the user isn't following
    mockProfile.following = [];

    render(<FollowButton clickedUser={mockClickedUser} />);

    // There is no logged in user, so it should be a Follow button, not Unfollow
    expect(screen.getByText('Follow')).toBeInTheDocument();

    // Queryby if looking for not because it returns null
    expect(screen.queryByText('Unfollow')).not.toBeInTheDocument();
  });

  test('renders UNfollow button correctly', () => {
    // Make it so the mockProfile is following the mockClickedUser
    mockProfile.following = [mockClickedUser.userId];

    render(
      <UserContext.Provider value={mockProfile}>
        <FollowButton clickedUser={mockClickedUser} />
      </UserContext.Provider>
    );

    // There is no logged in user, so it should be a Follow button, not Unfollow
    expect(screen.getByText('Unfollow')).toBeInTheDocument();

    // Queryby if looking for not because it returns null
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });

  test('calls handlefollow when clicked', () => {
    // Make sure the user isn't following
    mockProfile.following = [];

    // Have to be logged in, or the follow returns
    render(
      <UserContext.Provider value={mockProfile}>
        <FollowButton clickedUser={mockClickedUser} />
      </UserContext.Provider>
    );

    act(() => {
      userEvent.click(screen.getByText('Follow'));
    });

    // Follow was clicked, now the button should say unfollow
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });

  test('calls handleunfollow when clicked', () => {
    // Make it so the mockProfile is following the mockClickedUser
    mockProfile.following = [mockClickedUser.userId];

    // Have to be logged in, or the follow returns
    render(
      <UserContext.Provider value={mockProfile}>
        <FollowButton clickedUser={mockClickedUser} />
      </UserContext.Provider>
    );

    act(() => {
      userEvent.click(screen.getByText('Unfollow'));
    });

    // Follow was clicked, now the button should say unfollow
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});

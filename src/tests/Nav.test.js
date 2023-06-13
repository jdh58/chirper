import { render, screen, waitFor } from '@testing-library/react';
import Nav from '../components/Nav';
import { HashRouter, useLocation } from 'react-router-dom';
import UserContext from '../UserContext';
import '@testing-library/jest-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockedLocation,
}));

describe('Nav', () => {
  test('renders the Nav component when user is not authenticated', () => {
    // Set the user to null becuase we want to simulate unauthenticated
    const user = null;

    render(
      <HashRouter>
        <UserContext.Provider value={user}>
          <Nav chirpOverlay={jest.fn()} />
        </UserContext.Provider>
      </HashRouter>
    );

    const homeNavItem = screen.getByText('Home');
    const exploreNavItem = screen.getByText('Explore');
    const notificationsNavItem = screen.queryByText('Notifications');
    const bookmarksNavItem = screen.queryByText('Bookmarks');
    const profileNavItem = screen.queryByText('Profile');
    const profileIndicator = screen.queryByTestId('profile-indicator');

    expect(homeNavItem).toBeInTheDocument();
    expect(exploreNavItem).toBeInTheDocument();
    expect(notificationsNavItem).toBeNull();
    expect(bookmarksNavItem).toBeNull();
    expect(profileNavItem).toBeNull();
    expect(profileIndicator).toBeNull();
  });

  test('renders the Nav component when user is authenticated', () => {
    // Mock the user
    const user = {
      name: 'John Doe',
      username: 'johndoe',
      picURL: 'examplepic',
      userId: '123',
    };

    render(
      <HashRouter>
        <UserContext.Provider value={user}>
          <Nav chirpOverlay={jest.fn()} />
        </UserContext.Provider>
      </HashRouter>
    );

    const homeNavItem = screen.getByText('Home');
    const exploreNavItem = screen.getByText('Explore');
    const notificationsNavItem = screen.getByText('Notifications');
    const bookmarksNavItem = screen.getByText('Bookmarks');
    const profileNavItem = screen.getByText('Profile');
    const profileIndicator = screen.getByTestId('profile-indicator');

    expect(homeNavItem).toBeInTheDocument();
    expect(exploreNavItem).toBeInTheDocument();
    expect(notificationsNavItem).toBeInTheDocument();
    expect(bookmarksNavItem).toBeInTheDocument();
    expect(profileNavItem).toBeInTheDocument();
    expect(profileIndicator).toBeInTheDocument();
  });

  // Add more test cases for different scenarios as needed
});

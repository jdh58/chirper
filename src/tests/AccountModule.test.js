import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AccountModule from '../components/AccountModule';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('AccountModule', () => {
  const mockProfile = {
    userId: '123',
    name: 'John Doe',
    username: 'johndoe',
    picURL: 'examplepic',
  };

  test('renders correctly', () => {
    render(<AccountModule profile={mockProfile} />);

    expect(screen.getByTestId('account-module')).toBeInTheDocument();
  });

  test('navigates to the correct profile page on click', () => {
    render(<AccountModule profile={mockProfile} />);

    const accountModule = screen.getByTestId('account-module');
    userEvent.click(accountModule);

    expect(mockedNavigate).toHaveBeenCalledWith(
      `/profile/${mockProfile.userId}`
    );
  });

  test('renders ProfilePic component with the correct picURL prop', () => {
    render(<AccountModule profile={mockProfile} />);
    const profilePic = screen.getByTestId('profile-pic');
    expect(profilePic).toHaveAttribute('src', mockProfile.picURL);
  });

  test('renders name and @username elements correctly', () => {
    render(<AccountModule profile={mockProfile} />);
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(`@${mockProfile.username}`)).toBeInTheDocument();
  });
});

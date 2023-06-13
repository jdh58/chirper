import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chirp from '../components/Chirp';
import ProfileIndicator from '../components/ProfileIndicator';
import '@testing-library/jest-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('ProfileIndicator', () => {
  test('renders correctly', () => {
    // User doesn't need info for this test
    const mockUser = {};
    render(<ProfileIndicator user={mockUser} />);

    expect(screen.getByTestId('profile-indicator')).toBeInTheDocument();
  });

  test('renders correct information', () => {
    const mockUser = {
      name: 'John Doe',
      username: 'johndoe',
      picURL: 'examplepic',
      userId: '123',
    };

    render(<ProfileIndicator user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByTestId('profile-pic')).toHaveAttribute(
      'src',
      'examplepic'
    );
  });
});

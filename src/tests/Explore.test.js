import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Explore from '../components/Explore';
import { act } from 'react-dom/test-utils';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../useGrabTrends');
jest.mock('../useGrabAccounts');

describe('Explore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders loading icon when loading is true', () => {
    render(<Explore />);
    const loadingIcon = screen.getByAltText('loading icon');
    expect(loadingIcon).toBeInTheDocument();
  });

  test('does not render loading icon when loading is false', async () => {
    render(<Explore />);
    jest.runAllTimers();
    const loadingIcon = screen.queryByAltText('loading icon');

    // This will wait until it renders (which happesn once loading is over)
    await waitFor(() => {
      expect(loadingIcon).not.toBeInTheDocument();
    });
  });

  test('displays the Trending tab by default', () => {
    render(<Explore />);

    const trendingTab = screen.getByRole('button', { name: 'Trending' });

    expect(trendingTab).toHaveStyle('opacity: 1');
  });

  test('displays the Popular Accounts tab when clicked', () => {
    render(<Explore />);
    const popularAccountsTab = screen.getByRole('button', {
      name: 'Popular Accounts',
    });

    act(() => {
      userEvent.click(popularAccountsTab);
    });

    expect(popularAccountsTab).toHaveStyle('opacity: 1');
  });
});

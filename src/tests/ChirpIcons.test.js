import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChirpIcons from '../components/ChirpIcons';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import UserContext from '../UserContext';

// Mock the data required for the ChirpIcon component
const chirpData = {
  chirpId: '123',
  reChirps: [],
  likes: [],
  replies: [],
};

const mockUser = {
  userId: '123',
  likes: [],
  reChirps: [],
};

describe('ChirpIcons working full page', () => {
  test('renders the ChirpIcons component (full page)', () => {
    render(<ChirpIcons chirpData={chirpData} fullPage={true} />);

    // Assert that the component is rendered
    expect(screen.getByTestId('chirp-stats')).toBeInTheDocument();
  });

  test('increments like count and icon on like button click (full page)', () => {
    render(
      <UserContext.Provider value={mockUser}>
        <ChirpIcons chirpData={chirpData} fullPage={true} />
      </UserContext.Provider>
    );

    // Assert initial like count and icpon
    expect(screen.getByTestId('like-count')).toHaveTextContent('0');
    expect(screen.getByTestId('like-icon')).not.toHaveClass('fill');

    // Simulate a click on the like button
    act(() => {
      userEvent.click(screen.getByTestId('like-button'));
    });

    // Assert updated like count
    expect(screen.getByTestId('like-count')).toHaveTextContent('1');
    expect(screen.getByTestId('like-icon')).toHaveClass('fill');

    // Simulate a click on the like button again
    act(() => {
      userEvent.click(screen.getByTestId('like-button'));
    });

    // Assert like count to be decremented again
    expect(screen.getByTestId('like-count')).toHaveTextContent('0');
    expect(screen.getByTestId('like-icon')).not.toHaveClass('fill');
  });

  test('increments reChirp count and toggles icon on reChirp button click (full screen)', () => {
    render(
      <UserContext.Provider value={mockUser}>
        <ChirpIcons chirpData={chirpData} fullPage={false} />
      </UserContext.Provider>
    );

    // Assert initial reChirp count
    // It will not show a number if the like count is 0
    expect(screen.getByTestId('rechirp-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('rechirp-icon')).not.toHaveClass('fill');

    // Simulate a click on the like button
    act(() => {
      userEvent.click(screen.getByTestId('rechirp-button'));
    });

    // Assert updated rechrip count
    expect(screen.getByTestId('rechirp-count')).toHaveTextContent('1');
    expect(screen.getByTestId('rechirp-icon')).toHaveClass('fill');

    // Simulate a click on the rechrip button again
    act(() => {
      userEvent.click(screen.getByTestId('rechirp-button'));
    });

    // Assert like count to be decremented again
    // Same as above.
    expect(screen.getByTestId('rechirp-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('rechirp-icon')).not.toHaveClass('fill');
  });
});

describe('ChirpIcons working normal', () => {
  test('renders the ChirpIcons component normally', () => {
    render(<ChirpIcons chirpData={chirpData} fullPage={false} />);

    // Assert that the component is rendered
    expect(screen.getByTestId('chirp-icons')).toBeInTheDocument();
  });

  test('increments like count and icon on like button click (normal)', () => {
    render(
      <UserContext.Provider value={mockUser}>
        <ChirpIcons chirpData={chirpData} fullPage={false} />
      </UserContext.Provider>
    );

    // Assert initial like count
    // It will not show a number if the like count is 0
    expect(screen.getByTestId('like-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('like-icon')).not.toHaveClass('fill');

    // Simulate a click on the like button
    act(() => {
      userEvent.click(screen.getByTestId('like-button'));
    });

    // Assert updated like count
    expect(screen.getByTestId('like-count')).toHaveTextContent('1');
    expect(screen.getByTestId('like-icon')).toHaveClass('fill');

    // Simulate a click on the like button again
    act(() => {
      userEvent.click(screen.getByTestId('like-button'));
    });

    // Assert like count to be decremented again
    // Same as above.
    expect(screen.getByTestId('like-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('like-icon')).not.toHaveClass('fill');
  });

  test('increments reChirp count and toggles icon on reChirp button click (normal)', () => {
    render(
      <UserContext.Provider value={mockUser}>
        <ChirpIcons chirpData={chirpData} fullPage={false} />
      </UserContext.Provider>
    );

    // Assert initial reChirp count
    // It will not show a number if the like count is 0
    expect(screen.getByTestId('rechirp-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('rechirp-icon')).not.toHaveClass('fill');

    // Simulate a click on the like button
    act(() => {
      userEvent.click(screen.getByTestId('rechirp-button'));
    });

    // Assert updated rechrip count
    expect(screen.getByTestId('rechirp-count')).toHaveTextContent('1');
    expect(screen.getByTestId('rechirp-icon')).toHaveClass('fill');

    // Simulate a click on the rechrip button again
    act(() => {
      userEvent.click(screen.getByTestId('rechirp-button'));
    });

    // Assert like count to be decremented again
    // Same as above.
    expect(screen.getByTestId('rechirp-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('rechirp-icon')).not.toHaveClass('fill');
  });
});

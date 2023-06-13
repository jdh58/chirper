import { fireEvent, render, screen } from '@testing-library/react';
import ProfilePic from '../components/ProfilePic';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('ProfilePic', () => {
  test('renders profile pic', () => {
    const picURL = 'examplepic';
    render(<ProfilePic picURL={picURL} />);
    const profilePic = screen.getByTestId('profile-pic');

    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute('src', picURL);
    expect(profilePic).toHaveAttribute('alt', 'profile pic');
  });

  test('renders profile pic container', () => {
    render(<ProfilePic />);
    const profilePicContainer = screen.getByTestId('profile-pic-container');

    expect(profilePicContainer).toBeInTheDocument();
  });

  test('triggers onClick event on profile pic container', () => {
    const onClickMock = jest.fn();
    render(<ProfilePic onClick={onClickMock} />);
    const profilePicContainer = screen.getByTestId('profile-pic-container');

    userEvent.click(profilePicContainer);
    expect(onClickMock).toHaveBeenCalled();
  });

  test('renders input and icon in edit mode', () => {
    const inputOnClickMock = jest.fn();

    render(<ProfilePic editMode={true} inputOnClick={inputOnClickMock} />);

    const profilePicContainer = screen.getByTestId('profile-pic-container');
    const inputFile = screen.getByTestId('profile-pic-input');
    const inputIcon = screen.getByTestId('input-icon');

    expect(profilePicContainer).toBeInTheDocument();
    expect(inputFile).toBeInTheDocument();
    expect(inputFile).toHaveAttribute('type', 'file');

    fireEvent.change(inputFile);
    expect(inputOnClickMock).toHaveBeenCalled();

    expect(inputIcon).toBeInTheDocument();
    expect(inputIcon).toHaveAttribute('src', 'addPic.svg');
  });

  test('does not render input and icon when not in edit mode', () => {
    render(<ProfilePic />);
    const inputFile = screen.queryByTestId('profile-pic-input');
    const inputIcon = screen.queryByTestId('input-icon');

    expect(inputFile).not.toBeInTheDocument();
    expect(inputIcon).not.toBeInTheDocument();
  });

  test('does not render image overlay when noOverlay prop is true', () => {
    render(<ProfilePic noOverlay={true} />);

    const imageOverlay = screen.queryByTestId('image-overlay');

    expect(imageOverlay).not.toBeInTheDocument();
  });
});

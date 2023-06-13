import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Header', () => {
  test('renders the header component without back button by default', () => {
    render(<Header top="Top" bottom="Bottom" />);
    const header = screen.getByTestId('header');
    const backContainer = screen.queryByTestId('back-container');

    expect(header).toBeInTheDocument();
    expect(backContainer).toBeNull();
  });

  test('renders the header component with back button when hasBack prop is true', () => {
    render(<Header hasBack top="Top" bottom="Bottom" />);
    const header = screen.getByRole('banner');
    const backContainer = screen.getByTestId('back-container');

    expect(header).toBeInTheDocument();
    expect(backContainer).toBeInTheDocument();
  });

  test('calls the navigate function when the back button is clicked', () => {
    render(<Header hasBack top="Top" bottom="Bottom" />);
    const backContainer = screen.getByTestId('back-container');

    fireEvent.click(backContainer);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test('displays the provided top and bottom text', () => {
    render(<Header top="Hello" bottom="World" />);
    const topText = screen.getByText('Hello');
    const bottomText = screen.getByText('World');

    expect(topText).toBeInTheDocument();
    expect(bottomText).toBeInTheDocument();
  });
});

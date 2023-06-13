import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import TrendItem from '../components/TrendItem';
import '@testing-library/jest-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('TrendItem', () => {
  test('renders trend item with correct number, name, and count', () => {
    const number = 1;
    const name = 'Trending Topic';
    const count = 100;
    render(<TrendItem number={number} name={name} count={count} />);

    const trendItem = screen.getByText(`${number}`);
    const topic = screen.getByText(name);
    const chirpsCount = screen.getByText(`${count} Chirps`);
    const moreIcon = screen.getByAltText('more icon');

    expect(trendItem).toBeInTheDocument();
    expect(topic).toBeInTheDocument();
    expect(chirpsCount).toBeInTheDocument();
    expect(moreIcon).toBeInTheDocument();
  });

  test.only('navigates to the search results page on click', () => {
    const name = 'Trending Topic';
    render(<TrendItem name={name} />);

    fireEvent.click(screen.getByText(name));

    expect(mockedNavigate).toHaveBeenCalledWith('/search/Trending%20Topic');
  });
});

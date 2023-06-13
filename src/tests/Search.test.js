import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import '@testing-library/jest-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('Search', () => {
  test('renders search input and button', () => {
    render(<Search />);
    const searchInput = screen.getByPlaceholderText('Search Chirper');
    const searchButton = screen.getByAltText('search');

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchButton).toHaveAttribute('src', 'search.svg');
  });

  test('navigates to the search results page on form submission', () => {
    render(<Search />);
    const searchInput = screen.getByPlaceholderText('Search Chirper');

    fireEvent.change(searchInput, { target: { value: 'query' } });
    fireEvent.submit(screen.getByTestId('search-form'));

    expect(mockedNavigate).toHaveBeenCalledWith('/search/query');
  });

  test('encodes the search query parameter', () => {
    render(<Search />);
    const searchInput = screen.getByPlaceholderText('Search Chirper');

    fireEvent.change(searchInput, { target: { value: 'search term' } });
    fireEvent.submit(screen.getByTestId('search-form'));

    // URL encoded
    expect(mockedNavigate).toHaveBeenCalledWith('/search/search%20term');
  });

  test('renders search input with default value', () => {
    const defaultValue = 'default value';
    render(<Search defaultValue={defaultValue} />);
    const searchInput = screen.getByPlaceholderText('Search Chirper');

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('value', defaultValue);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import Profile from '../components/Profile';
import '@testing-library/jest-dom';
import { HashRouter } from 'react-router-dom';

// Mock the useNavigate() function so I can pick up on it in the tests
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Profile component', () => {
  test('renders without errors', () => {
    render(
      <HashRouter>
        <Profile />
      </HashRouter>
    );
  });

  /* I can't really test the other stuff without a test database,
  as nearly all content is reliant on fetching from a database based
  off a URL parameter, which is difficult to mock with my setup.
  I'll come back to this later, though. */
});

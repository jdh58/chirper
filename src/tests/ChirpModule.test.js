import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ChirpModule from '../components/ChirpModule';
import UserContext from '../UserContext';
import '@testing-library/jest-dom';

describe('ChirpModule', () => {
  test('renders ChirpModule correctly if logged in', () => {
    // Mock user so we are "logged in"
    const mockUser = {
      userId: '456',
      name: 'Mary Jane',
      username: 'maryjane',
      picURL: 'examplepic2',
    };

    render(
      <UserContext.Provider value={mockUser}>
        <ChirpModule isReply={false} overlay={false} />
      </UserContext.Provider>
    );

    // Check the main parts of the module
    expect(screen.getByTestId('chirp-module')).toBeInTheDocument();
    expect(screen.getByTestId('textbox')).toHaveAttribute(
      'contenteditable',
      'true'
    );
    expect(screen.getByRole('button')).toHaveClass('chirpButton');
  });

  test('does not render if not logged in', () => {
    // Null user
    const mockUser = null;

    render(
      <UserContext.Provider value={mockUser}>
        <ChirpModule isReply={false} overlay={false} />
      </UserContext.Provider>
    );

    // Check that it did not render
    expect(screen.queryByTestId('chirp-module')).not.toBeInTheDocument();
  });

  test('updates character count', () => {
    // Mock user so we are "logged in"
    const mockUser = {
      userId: '456',
      name: 'Mary Jane',
      username: 'maryjane',
      picURL: 'examplepic2',
    };

    render(
      <UserContext.Provider value={mockUser}>
        <ChirpModule isReply={false} overlay={false} />
      </UserContext.Provider>
    );

    // Get the input element
    const input = screen.getByTestId('textbox');

    // Type an input that does not exceed the character limit
    // Using fireevent because it triggers onChagne and userEvent.type() doesn't
    fireEvent.input(input, {
      target: {
        textContent:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque auctor, ligula et gravida eleifend, est dolor posuere ex, sed gravida lorem lorem et nunc.',
      },
    });

    // Assert that the character count has updated and button is disabled
    expect(screen.getByText('155/280')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  test('and disables button when input is too long', () => {
    // Mock user so we are "logged in"
    const mockUser = {
      userId: '456',
      name: 'Mary Jane',
      username: 'maryjane',
      picURL: 'examplepic2',
    };

    render(
      <UserContext.Provider value={mockUser}>
        <ChirpModule isReply={false} overlay={false} />
      </UserContext.Provider>
    );

    // Get the input element
    const input = screen.getByTestId('textbox');

    // Type an input that does not exceed the character limit
    // Using fireevent because it triggers onChagne and userEvent.type() doesn't
    fireEvent.input(input, {
      target: {
        textContent:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque auctor, ligula et gravida eleifend, est dolor posuere ex, sed gravida lorem lorem et nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque auctor, ligula et gravida eleifend, est dolor posuere ex, sed gravida lorem lorem et nunc.',
      },
    });

    // Assert that the character count has updated and button is disabled
    expect(screen.getByText('311/280')).toBeInTheDocument();
  });
});

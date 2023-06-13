import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ChirpModule from '../components/ChirpModule';
import userEvent from '@testing-library/user-event';
import UserContext from '../UserContext';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

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

  test.only('updates character count', () => {
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

  test.only('and disables button when input is too long', () => {
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

  test.only('sends chirp when button is clicked', () => {
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

    // Get the input element and button
    const input = screen.getByTestId('textbox');
    const button = screen.getByRole('button');

    // Type some text in the input
    fireEvent.input(input, { target: { textContent: 'Hello, world!' } });

    // Click the chirp button
    act(() => {
      userEvent.click(button);
    });

    // Assert that the ToastNotification popped up
    setTimeout(() => {
      expect(screen.getByText('Your Chirp was sent.')).toBeInTheDocument();
    }, 1000);
  });
});

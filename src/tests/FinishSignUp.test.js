import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FinishSignUp from '../components/FinishSignUp';

describe('FinishSignUp', () => {
  test('displays the input fields and submit button', () => {
    render(<FinishSignUp />);
    const nameInput = screen.getByTestId('name');
    const usernameInput = screen.getByTestId('username');
    const bioTextarea = screen.getByTestId('bio');
    const submitButton = screen.getByRole('button', { name: 'Finish Sign Up' });

    expect(nameInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(bioTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('updates the user input state when typing in the name field', () => {
    render(<FinishSignUp />);
    const nameInput = screen.getByTestId('name');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(nameInput.value).toBe('John Doe');
  });

  test('displays the active state when there is text in the name field', () => {
    render(<FinishSignUp />);
    const nameInput = screen.getByTestId('name');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    const namePlaceholder = screen.getByText('Name');
    expect(namePlaceholder).toHaveClass('active');
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react'
import SingIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode}) => children,
  }
})

jest.mock('../../hooks/auth',() => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    })
  }
})

describe('SingIn Pge', () => {
  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SingIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    }, {timeout: 10})
  })
})

import React from 'react';
import { render, fireEvent } from '@testing-library/react'
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

describe('SingIn Pge', () =>
{
  it('should be able to sign in', () => {
    const { getByPlaceholderText, getByText } = render(<SingIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(buttonElement);

    expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
  })
})

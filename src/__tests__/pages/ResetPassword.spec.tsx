import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedLocationReplace = jest.fn(() => '?token=');
const mockedAddToast = jest.fn();
const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
    useLocation: () => ({
      search: {
        replace: mockedLocationReplace,
      },
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Reset Password', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('shold be able to submet a new password', async () => {
    apiMock.onPost('/password/reset').replyOnce(200, {});

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirme a Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('shold not be able to reset password with invalid token', async () => {
    apiMock.onPost('/password/reset').reply(200, {});
    mockedLocationReplace.mockImplementation();

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirme a Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/forgot-password');
    });
  });

  it('shold not be able to submet a new password', async () => {
    apiMock.onPost('/password/reset').replyOnce(400, {});

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirme a Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: 'non' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});

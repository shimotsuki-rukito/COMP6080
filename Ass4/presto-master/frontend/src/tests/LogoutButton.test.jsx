import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Logout from '../components/LogoutButton';

describe('Logout Component', () => {
  const setToken = jest.fn();
  const token = 'mockToken123';
  const axiosMock = new MockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  test('does not change token on API error', async () => {
    axiosMock.onPost('http://localhost:5005/admin/auth/logout').networkError();
    render(<Logout token={token} setToken={setToken} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(setToken).not.toHaveBeenCalled();
  });
});

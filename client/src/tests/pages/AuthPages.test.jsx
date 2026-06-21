import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from '../../pages/Login';
import Register from '../../pages/Register';

const auth = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  user: null,
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => auth,
}));

describe('Authentication pages', () => {
  beforeEach(() => {
    auth.login.mockReset();
    auth.register.mockReset();
    auth.user = null;
  });

  it('submits valid login credentials', async () => {
    auth.login.mockResolvedValueOnce();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith('person@example.com', 'Password123!');
    });
  });

  it('announces login failures', async () => {
    auth.login.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('submits all registration fields as one object', async () => {
    auth.register.mockResolvedValueOnce();
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Daily Target (kg CO2e)'), {
      target: { value: '12' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(auth.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'new@example.com',
        password: 'Password123!',
        daily_target_kg: 12,
      });
    });
  });

  it('announces registration failures', async () => {
    auth.register.mockRejectedValueOnce(new Error('network failure'));
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Registration failed');
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityForm } from '../../components/Activities/ActivityForm';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('ActivityForm', () => {
  beforeEach(() => {
    api.post.mockReset();
  });

  function fillValidForm() {
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'transportation' },
    });
    fireEvent.change(screen.getByLabelText('Activity Type'), {
      target: { value: 'car_petrol' },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/), {
      target: { value: '10' },
    });
  }

  it('calculates an estimate and submits a valid activity', async () => {
    const onSuccess = vi.fn();
    api.post.mockResolvedValueOnce({ data: {} });
    render(<ActivityForm onSuccess={onSuccess} />);

    fillValidForm();
    expect(await screen.findByText(/1.92 kg CO2e/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Log Activity' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/activities', expect.objectContaining({
        category: 'transportation',
        subcategory: 'car_petrol',
        quantity: 10,
        unit: 'km',
      }));
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('announces API failures', async () => {
    api.post.mockRejectedValueOnce(new Error('network failure'));
    render(<ActivityForm />);

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Log Activity' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to log activity');
  });

  it('announces validation errors without submitting', async () => {
    render(<ActivityForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Log Activity' }));

    expect(await screen.findByText('Category is required')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
});


import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CarbonScore } from '../../components/Dashboard/CarbonScore';

describe('CarbonScore Component', () => {
  it('renders loading state', () => {
    const { container } = render(<CarbonScore isLoading={true} />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders score correctly', () => {
    render(<CarbonScore isLoading={false} targetKg={10} todayData={{ total_kg: 5 }} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText(/5.0 kg remaining/)).toBeInTheDocument();
  });

  it('handles target exceeded', () => {
    render(<CarbonScore isLoading={false} targetKg={10} todayData={{ total_kg: 15 }} />);
    expect(screen.getByText('15.0')).toBeInTheDocument();
    expect(screen.getByText(/Target exceeded/)).toBeInTheDocument();
  });
});

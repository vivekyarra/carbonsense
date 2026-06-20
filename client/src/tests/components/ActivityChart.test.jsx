
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActivityChart } from '../../components/Dashboard/ActivityChart';

// Mock recharts as it uses SVG APIs that might not fully work in jsdom without issues
vi.mock('recharts', () => ({
  /**
   *
   * @param root0
   * @param root0.children
   */
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  /**
   *
   * @param root0
   * @param root0.children
   */
  PieChart: ({ children }) => <div>{children}</div>,
  /**
   *
   * @param root0
   * @param root0.children
   */
  Pie: ({ children }) => <div>{children}</div>,
  /**
   *
   */
  Cell: () => <div>Cell</div>,
  /**
   *
   */
  Tooltip: () => <div>Tooltip</div>,
  /**
   *
   */
  Legend: () => <div>Legend</div>,
}));

describe('ActivityChart Component', () => {
  it('renders loading state', () => {
    const { container } = render(<ActivityChart isLoading={true} />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<ActivityChart isLoading={false} breakdown={{ transportation: 0, food: 0, energy: 0 }} />);
    expect(screen.getByText('No data for today yet.')).toBeInTheDocument();
  });

  it('renders chart when data is present', () => {
    render(<ActivityChart isLoading={false} breakdown={{ transportation: 5, food: 2, energy: 0 }} />);
    expect(screen.getByLabelText(/Donut chart/i)).toBeInTheDocument();
    expect(screen.getByText(/Transportation: 5.0 kg/)).toBeInTheDocument();
  });
});

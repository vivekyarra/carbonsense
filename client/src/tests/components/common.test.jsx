
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

describe('Common Components', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles clicks', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('renders with label and handles input', () => {
      render(<Input label="Email" id="email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<Input label="Email" id="email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Spinner', () => {
    it('renders', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    });
  });
});

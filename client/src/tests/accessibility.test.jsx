import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { ActivityForm } from '../components/Activities/ActivityForm';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    register: vi.fn(),
  }),
}));

/**
 * Asserts that rendered markup has no automated WCAG violations.
 * @param {HTMLElement} container - Rendered test container.
 * @returns {Promise<void>}
 */
async function expectNoViolations(container) {
  // jsdom does not implement canvas, so color contrast is verified in-browser.
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('Accessibility', () => {
  it('keeps the login page free of automated violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    await expectNoViolations(container);
  });

  it('keeps the registration page free of automated violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    await expectNoViolations(container);
  });

  it('keeps the activity form free of automated violations', async () => {
    const { container } = render(<ActivityForm />);
    await expectNoViolations(container);
  });
});

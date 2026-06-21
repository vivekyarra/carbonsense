/**
 * @file Reusable Spinner component.
 */

import PropTypes from 'prop-types';

/**
 * @description Accessible loading indicator.
 * @param {object} props - Component properties.
 * @param {'sm'|'md'|'lg'} [props.size] - Spinner size.
 * @param {string} [props.className] - Additional classes.
 * @returns {import('react').ReactNode} Loading indicator.
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-green-600 ${sizes[size]}`}
      ></div>
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

/**
 * @file Reusable Input component with error handling.
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @description Labelled form input with an associated validation message.
 */
export const Input = forwardRef(({ 
  label, 
  id, 
  type = 'text', 
  error, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors duration-200`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-700" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

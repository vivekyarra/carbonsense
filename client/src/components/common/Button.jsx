/**
 * @file Reusable Button component.
 */

import PropTypes from 'prop-types';

/**
 * @description Accessible button with consistent visual variants.
 * @param {object} props - Button properties.
 * @param {import('react').ReactNode} props.children - Button content.
 * @param {function(): void} [props.onClick] - Click handler.
 * @param {'button'|'submit'|'reset'} [props.type] - Native button type.
 * @param {'primary'|'secondary'|'danger'|'ghost'} [props.variant] - Visual style.
 * @param {string} [props.className] - Additional classes.
 * @param {boolean} [props.disabled] - Disabled state.
 * @returns {import('react').ReactNode} Styled native button.
 */
export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseStyle = 'inline-flex min-h-11 justify-center items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'border-transparent text-white bg-green-700 hover:bg-green-800 focus-visible:ring-green-700 shadow-sm',
    secondary: 'border-gray-300 text-gray-800 bg-white hover:bg-gray-50 focus-visible:ring-green-700 shadow-sm',
    danger: 'border-transparent text-white bg-red-700 hover:bg-red-800 focus-visible:ring-red-700 shadow-sm',
    ghost: 'border-transparent text-gray-800 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-700',
  };

  const activeStyle = variants[variant] || variants.primary;
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${activeStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

/**
 * @file Reusable Button component.
 */



/**
 *
 * @param root0
 * @param root0.children
 * @param root0.onClick
 * @param root0.type
 * @param root0.variant
 * @param root0.className
 * @param root0.disabled
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
  const baseStyle = 'inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-sm',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-green-500 shadow-sm',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost: 'border-transparent text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500',
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

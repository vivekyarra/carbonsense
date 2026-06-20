/**
 * @file Reusable Spinner component.
 */



/**
 *
 * @param root0
 * @param root0.size
 * @param root0.className
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`} aria-busy="true" aria-label="Loading...">
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-green-600 ${sizes[size]}`}
      ></div>
    </div>
  );
}

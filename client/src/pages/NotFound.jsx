/**
 * @file Not Found page.
 */


import { Link } from 'react-router-dom';

/**
 *
 */
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-9xl font-bold text-green-100">404</h1>
      <h2 className="text-3xl font-extrabold text-gray-900 mt-8 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
      >
        Go back home
      </Link>
    </div>
  );
}

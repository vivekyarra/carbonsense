/**
 * @file Not Found page.
 */


import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

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
      <Link to="/">
        <Button variant="primary">Go back home</Button>
      </Link>
    </div>
  );
}

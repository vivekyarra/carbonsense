/**
 * @file Navigation bar component.
 */


import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Leaf, LogOut, Menu } from 'lucide-react';
import { Button } from '../common/Button';

/**
 *
 * @param root0
 * @param root0.onMenuClick
 */
export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <Leaf className="w-6 h-6 mr-2 text-green-600" />
              <span className="self-center whitespace-nowrap text-green-700">CarbonSense</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Hello, <span className="font-semibold">{user.name}</span>
                </span>
                <Button variant="ghost" onClick={logout} className="p-2 text-gray-600 hover:text-red-600" aria-label="Logout">
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline-block ml-2">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * @file Sidebar navigation component.
 */


import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListPlus, History, Lightbulb } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Log Activity', path: '/log', icon: ListPlus },
  { name: 'History', path: '/history', icon: History },
  { name: 'Tips', path: '/tips', icon: Lightbulb },
];

/**
 *
 * @description Responsive primary navigation.
 * @param {object} props - Component properties.
 * @param {boolean} props.isOpen - Mobile navigation state.
 * @param {function(): void} props.onClose - Closes the mobile navigation.
 * @returns {import('react').ReactNode} Sidebar navigation.
 */
export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" 
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Primary navigation"
      >
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3 bg-white space-y-1" aria-label="Main">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => `
                    flex items-center px-2 py-2 text-base font-normal rounded-lg group
                    ${isActive ? 'bg-green-100 text-green-900' : 'text-gray-900 hover:bg-gray-100'}
                  `}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <item.icon className={`w-6 h-6 transition duration-75 ${
                    location.pathname === item.path ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`} aria-hidden="true" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

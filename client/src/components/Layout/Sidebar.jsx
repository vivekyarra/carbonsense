/**
 * @file Sidebar navigation component.
 */


import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListPlus, History, Lightbulb } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Log Activity', path: '/log', icon: ListPlus },
  { name: 'History', path: '/history', icon: History },
  { name: 'Tips', path: '/tips', icon: Lightbulb },
];

/**
 *
 * @param root0
 * @param root0.isOpen
 * @param root0.onClose
 */
export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 bg-white space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => `
                    flex items-center px-2 py-2 text-base font-normal rounded-lg group
                    ${isActive ? 'bg-green-100 text-green-900' : 'text-gray-900 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className={`w-6 h-6 transition duration-75 ${
                    location.pathname === item.path ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`} />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

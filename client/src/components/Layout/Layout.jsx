/**
 * @file Main layout wrapper.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

/**
 * @description Main application layout with responsive sidebar and top navigation bar.
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-white px-4 py-2 text-green-800 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Navbar
        isMenuOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div 
        className="flex flex-col w-full bg-gray-50 relative h-full lg:pl-64 pt-16"
      >
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

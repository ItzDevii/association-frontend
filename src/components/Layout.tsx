'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/KeycloakContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, username } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-white border-end shadow-sm p-3">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 d-flex flex-column px-0">
          {/* Header */}
          <header className="d-flex justify-content-end align-items-center px-4 py-3 border-bottom bg-white">
            <div className="position-relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="btn btn-outline-secondary d-flex align-items-center dropdown-toggle"
              >
                <i className="pi pi-user me-2"></i>
                <span>{username ?? 'Account'}</span>
              </button>

              {dropdownOpen && (
                <ul
                  className="dropdown-menu show shadow-sm"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    zIndex: 1000,
                    display: 'block',
                  }}
                >
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center"
                      onClick={logout}
                    >
                      <i className="pi pi-sign-out me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-grow-1 px-4 py-4 bg-light">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
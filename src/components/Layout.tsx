'use client';

import Sidebar from './Sidebar';
import { useAuth } from '@/context/KeycloakContext';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, username } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-white border-end shadow-sm p-3">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="col-md-9 col-lg-10 d-flex flex-column px-0">
          {/* Top Header */}
          <header className="d-flex justify-content-end align-items-center px-4 py-3 border-bottom bg-white">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="pi pi-user me-2"></i>
                <span>{username ?? 'Account'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="pi pi-sign-out me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow-1 px-4 py-4 bg-light">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;